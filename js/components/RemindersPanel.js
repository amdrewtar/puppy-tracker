import state from "../core/State.js";
import Constants from "../core/Constants.js";
import AddReminderModal from "./AddReminderModal.js";
import { loadRemindersFromDB } from "../core/loadRemindersFromDB.js";

export default class RemindersPanel {
  constructor(root) {
    this.root = root;
    this.startLiveUpdate();
  }

  // =====================================================
  // 🔄 RENDER
  // =====================================================
  async render() {
    await loadRemindersFromDB();

    const reminders = state
      .getFutureReminders()
      .slice()
      .sort((a, b) => {
        const aDate = new Date(`${a.date} ${a.time || "00:00"}`);
        const bDate = new Date(`${b.date} ${b.time || "00:00"}`);
        return aDate - bDate;
      });

    this.currentReminders = reminders;

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
              ? reminders.map((r, i) => this.renderItem(r, i)).join("")
              : this.renderEmptyItem()
          }
        </div>
      </div>
    `;

    this.bind();
  }

  // =====================================================
  // ITEM
  // =====================================================
  renderItem(reminder, index) {
    const showTime =
      reminder.time && reminder.time !== "00:00"
        ? `<span class="meta-item">${Constants.ICONS.CLOCK} ${reminder.time}</span>`
        : "";

    const showComment = reminder.comment
      ? `<div class="meta-item">${Constants.ICONS.NOTE} ${reminder.comment}</div>`
      : "";

    return `
      <div
        class="reminder-item"
        data-id="${reminder.id}"
        data-date="${reminder.date}"
        data-time="${reminder.time || ""}"
        style="animation-delay:${index * 0.08}s"
      >

        <!-- ACTIONS (НЕ МЕНЯЕМ КЛАССЫ) -->
        <div class="event-actions">
          <button
            class="event-edit"
            data-action="edit"
            title="Edit reminder"
          >
            ${Constants.ICONS.EDIT}
          </button>

          <button
            class="event-delete"
            data-action="delete"
            title="Delete reminder"
          >
            ${Constants.ICONS.DELETE}
          </button>
        </div>

        <div class="reminder-icon">${Constants.ICONS.REMINDER}</div>

        <div class="reminder-content">
          <div class="reminder-title"><strong>${reminder.title}</strong></div>

          <div class="reminder-meta">
            <span class="meta-item">
              ${Constants.ICONS.CALENDAR} ${reminder.dateLabel}
            </span>
            ${showTime}
          </div>

          <div class="reminder-meta">${showComment}</div>
        </div>
      </div>
    `;
  }

  renderEmptyItem() {
    return `
      <div class="reminder-item empty">
        <div class="reminder-icon">${Constants.ICONS.NONE}</div>
        <div class="reminder-content" style="margin: auto 10px; font-size: 15px;">
          <span class="reminder-meta">Нет ближайших событий</span>
        </div>
      </div>
    `;
  }

  // =====================================================
  // ❌ REMOVE (НЕ ТРОГАЕМ)
  // =====================================================
  async removeReminderItem(item) {
    if (item.classList.contains("removing")) return;

    const id = item.dataset.id;
    if (!id) return;

    item.classList.add("removing");

    try {
      await fetch("/api/reminders-delete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      item.classList.remove("removing");
      return;
    }

    item.addEventListener(
      "animationend",
      () => {
        item.remove();
        state.reminders = state.reminders.filter((r) => r.id !== id);

        const list = this.root.querySelector(".reminders-list");
        if (list && list.children.length === 0) {
          list.innerHTML = this.renderEmptyItem();
        }
      },
      { once: true }
    );
  }

  // =====================================================
  // EVENTS
  // =====================================================
  bind() {
    const addBtn = this.root.querySelector("#add-reminder-btn");

    this.root.onclick = (e) => {
      // ===== DELETE =====
      const deleteBtn = e.target.closest("[data-action='delete']");
      if (deleteBtn) {
        const item = deleteBtn.closest(".reminder-item");
        if (item) this.removeReminderItem(item);
        return;
      }

      // ===== EDIT =====
      const editBtn = e.target.closest("[data-action='edit']");
      if (editBtn) {
        const item = editBtn.closest(".reminder-item");
        if (!item) return;

        const id = item.dataset.id;
        const reminder = this.currentReminders.find((r) => r.id == id);
        if (!reminder) return;

        // 🔥 ТО ЖЕ МОДАЛЬНОЕ ОКНО, НО С ДАННЫМИ
        new AddReminderModal(
          (updatedReminder) => {
            Object.assign(reminder, updatedReminder);
            reminder.dateLabel = new Date(reminder.date).toLocaleDateString();
            this.render();
          },
          reminder // ← передаём ВСЕ поля
        ).open();
      }
    };

    // ===== ADD =====
    addBtn.onclick = () => {
      new AddReminderModal((newReminder) => {
        if (!newReminder.date) {
          newReminder.date = state.getSelectedDateString();
        }

        newReminder.dateLabel = new Date(newReminder.date).toLocaleDateString();

        state.reminders.push(newReminder);
        this.render();
      }).open();
    };
  }

  // =====================================================
  // ⏱️ LIVE UPDATE (НЕ ТРОГАЕМ)
  // =====================================================
  startLiveUpdate() {
    if (this._liveTimer) return;

    this._liveTimer = setInterval(() => {
      const now = new Date();
      const items = this.root.querySelectorAll(".reminder-item:not(.empty)");

      items.forEach((item) => {
        const date = item.dataset.date;
        const time = item.dataset.time;
        if (!date || !time) return;

        let reminderDate;

        if (time === "00:00") {
          // ⏰ ALL-DAY POINT
          // удаляется в 00:00 следующего дня
          reminderDate = new Date(`${date} 00:00`);
          reminderDate.setDate(reminderDate.getDate() + 1);
        } else {
          // ⏱️ обычное напоминание
          reminderDate = new Date(`${date} ${time}`);
        }
        const diffMs = reminderDate - now;
        const diffMin = diffMs / 60000;

        if (diffMs <= -60_000) {
          this.removeReminderItem(item);
          return;
        }

        if (diffMin <= 5) {
          item.classList.add("reminder-soon");
        } else {
          item.classList.remove("reminder-soon");
        }
      });
    }, 1000);
  }
}
