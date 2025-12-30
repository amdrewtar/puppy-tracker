import state from "../core/State.js";
import Constants from "../core/Constants.js";
import AddReminderModal from "./AddReminderModal.js";
import { loadRemindersFromDB } from "../core/loadRemindersFromDB.js";

export default class RemindersPanel {
  constructor(root) {
    this.root = root;
  }

  async render() {
    // 🔥 Загружаем и чистим БД перед отрисовкой
    await loadRemindersFromDB();

    const reminders = state
      .getFutureReminders()
      .slice()
      .sort((a, b) => {
        const aDate = new Date(`${a.date} ${a.time || "00:00"}`);
        const bDate = new Date(`${b.date} ${b.time || "00:00"}`);
        return aDate - bDate;
      });

    console.log("📥 Reminders loaded from state:", reminders);

    this.root.innerHTML = `
      <div class="card reminders-card">
        <div class="reminders-header">
          <h3>Reminders & Future Events</h3>

          <button
            class="add-reminder-btn"
            id="add-reminder-btn"
            title="Add reminder"
            type="button"
          >
            ${Constants.ICONS.PLUS}
          </button>
        </div>

        <div class="reminders-list">
          ${
            reminders.length
              ? reminders.map((r) => this.renderItem(r)).join("")
              : this.renderEmptyItem()
          }
        </div>
      </div>
    `;

    this.bind();
  }

  renderItem(reminder) {
    const showTime =
      reminder.time && reminder.time !== "00:00"
        ? `<span class="meta-item">${Constants.ICONS.CLOCK} ${reminder.time}</span>`
        : "";

    const showComment = reminder.comment
      ? `<div class="meta-item">
         ${Constants.ICONS.NOTE} ${reminder.comment}
       </div>`
      : "";

    return `
    <div class="reminder-item" data-id="${reminder.id}">
      
      <!-- ❌ DELETE BUTTON -->
      <button
        class="reminder-delete"
        title="Delete reminder"
        data-action="delete"
      >
        ✕
      </button>

      <div class="reminder-icon">
        ${Constants.ICONS.REMINDER}
      </div>

      <div class="reminder-content">
        <div class="reminder-title">
          <strong>${reminder.title}</strong>
        </div>

        <div class="reminder-meta">
          <span class="meta-item">
            ${Constants.ICONS.CALENDAR} ${reminder.dateLabel}
          </span>
          ${showTime}
        </div>

        <div class="reminder-meta">
          ${showComment}
        </div>
      </div>
    </div>
  `;
  }

  // 🌟 EMPTY STATE
  renderEmptyItem() {
    return `
      <div class="reminder-item empty">
        <div class="reminder-icon">
          ${Constants.ICONS.NONE}
        </div>

        <div class="reminder-content">
          <div class="reminder-title">
            <strong>Нет ближайших событий</strong>
          </div>

          <div class="reminder-meta">
            <span class="meta-item">
              ${Constants.ICONS.CALENDAR} Создайте новое событие
            </span>
          </div>
        </div>
      </div>
    `;
  }

  bind() {
    const addBtn = this.root.querySelector("#add-reminder-btn");

    this.root.onclick = async (e) => {
      const deleteBtn = e.target.closest("[data-action='delete']");
      if (!deleteBtn) return;

      e.stopPropagation();

      const item = deleteBtn.closest(".reminder-item");
      if (!item) return;

      const id = item.dataset.id;
      if (!id) return;

      console.log("🗑️ Delete reminder:", id);

      // 🔴 анимация удаления
      item.classList.add("removing");

      // 👉 DELETE из БД
      try {
        const res = await fetch("/api/reminders-delete.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();
        console.log("📥 DELETE response:", data);
      } catch (err) {
        console.error("❌ Delete failed", err);
        item.classList.remove("removing");
        return;
      }

      // 👉 после анимации — перерисовка
      setTimeout(() => {
        state.reminders = state.reminders.filter((r) => r.id !== id);
        this.render();
      }, 250);
    };

    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      new AddReminderModal(() => this.render()).open();
    });
  }
}
