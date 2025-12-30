import Modal from "../ui/Modal.js";
import Constants from "../core/Constants.js";

export default class AddReminderModal {
  constructor(onSave) {
    this.modal = new Modal();
    this.onSave = onSave;
    this.lastReminder = null;
  }

  open() {
    this.modal.open(`
      <div class="modal-window">

        <!-- HEADER -->
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-icon">${Constants.ICONS.REMINDER}</div>
            <h2>Add Reminder</h2>
          </div>
          <button class="modal-close" data-action="close">✕</button>
        </div>

        <!-- BODY -->
        <div class="modal-body">

          <h4>Title</h4>
          <div class="input-group">
            <input
              type="text"
              id="reminder-title"
              placeholder="Vet appointment"
            />
          </div>

          <h4>Date</h4>
          <div class="input-group">
            <span class="input-icon">${Constants.ICONS.CALENDAR}</span>
            <input type="date" id="reminder-date" />
          </div>

          <h4>Time (optional)</h4>
          <div class="input-group">
            <span class="input-icon">${Constants.ICONS.CLOCK}</span>
            <input type="time" id="reminder-time" value="00:00" />
          </div>

          <h4>Note (optional)</h4>
          <div class="input-group">
            <span class="input-icon">${Constants.ICONS.NOTE}</span>
            <textarea
              id="reminder-note"
              placeholder="Add details..."
              rows="4"
            ></textarea>
          </div>

          <h4 class="quick-title">Quick select</h4>
          <div class="quick-select">
            <button data-offset="0" class="active">Today</button>
            <button data-offset="1">Tomorrow</button>
            <button data-offset="7">In a week</button>
          </div>

        </div>

        <!-- FOOTER -->
        <div class="modal-footer">
          <button class="btn-secondary" data-action="cancel">
            Cancel
          </button>

          <button class="btn-primary" id="save-reminder" disabled>
            Save Reminder
          </button>
        </div>

      </div>
    `);

    this.bind();
  }

  bind() {
    const titleInput = document.getElementById("reminder-title");
    const dateInput = document.getElementById("reminder-date");
    const timeInput = document.getElementById("reminder-time");
    const noteInput = document.getElementById("reminder-note");
    const saveBtn = document.getElementById("save-reminder");

    // today by default
    dateInput.valueAsDate = new Date();

    const validate = () => {
      saveBtn.disabled = !titleInput.value.trim() || !dateInput.value;
    };

    titleInput.addEventListener("input", validate);
    dateInput.addEventListener("change", validate);

    // quick select
    document.querySelectorAll(".quick-select button").forEach((btn) => {
      btn.onclick = () => {
        document
          .querySelectorAll(".quick-select button")
          .forEach((b) => b.classList.remove("active"));

        btn.classList.add("active");

        const d = new Date();
        d.setDate(d.getDate() + Number(btn.dataset.offset));
        dateInput.valueAsDate = d;

        validate();
      };
    });

    dateInput.addEventListener("change", () => {
      document
        .querySelectorAll(".quick-select button")
        .forEach((b) => b.classList.remove("active"));
    });

    // close / cancel
    document
      .querySelectorAll("[data-action='close'], [data-action='cancel']")
      .forEach((btn) => {
        btn.onclick = () => this.modal.close();
      });

    // SAVE
    saveBtn.onclick = async () => {
      const reminder = {
        id: Date.now().toString(),
        title: titleInput.value.trim(),
        date: dateInput.value,
        time: timeInput.value || "00:00",
        note: noteInput.value.trim(), // ✅ ВАЖНО
        createdAt: new Date().toISOString(),
      };

      this.lastReminder = reminder;
      console.log("🧾 LAST REMINDER JSON:", reminder);

      // 👉 POST в БД
      try {
        await fetch("/api/reminders-create.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reminder),
        });
        console.log("📥 POST response:", data);
      } catch (err) {
        console.error("❌ DB save error", err);
      }

      if (this.onSave) {
        this.onSave(reminder);
      }

      this.modal.close();
    };
  }
}
