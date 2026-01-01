import Modal from "../ui/Modal.js";
import Constants from "../core/Constants.js";

export default class AddReminderModal {
  constructor(onSave, reminder = null) {
    this.modal = new Modal();
    this.onSave = onSave;
    this.reminder = reminder; // 👈 если есть — edit mode
  }

  open() {
    const isEdit = !!this.reminder;

    this.modal.open(`
      <div class="modal-window">

        <!-- HEADER -->
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-icon">${Constants.ICONS.REMINDER}</div>
            <h2>${isEdit ? "Edit Reminder" : "Add Reminder"}</h2>
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
            ${isEdit ? "Save Changes" : "Save Reminder"}
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

    const isEdit = !!this.reminder;

    // ===============================
    // PREFILL (EDIT MODE)
    // ===============================
    if (isEdit) {
      titleInput.value = this.reminder.title || "";
      dateInput.value = this.reminder.date || "";
      timeInput.value = this.reminder.time || "00:00";
      noteInput.value = this.reminder.comment || this.reminder.note || "";

      saveBtn.disabled = false;

      document
        .querySelectorAll(".quick-select button")
        .forEach((b) => b.classList.remove("active"));
    } else {
      // today by default
      dateInput.valueAsDate = new Date();
    }

    const validate = () => {
      saveBtn.disabled = !titleInput.value.trim() || !dateInput.value;
    };

    titleInput.addEventListener("input", validate);
    dateInput.addEventListener("change", validate);

    // ===============================
    // QUICK SELECT
    // ===============================
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

    // ===============================
    // CLOSE / CANCEL
    // ===============================
    document
      .querySelectorAll("[data-action='close'], [data-action='cancel']")
      .forEach((btn) => {
        btn.onclick = () => this.modal.close();
      });

    // ===============================
    // SAVE
    // ===============================
    saveBtn.onclick = async () => {
      const reminder = {
        id: isEdit ? this.reminder.id : Date.now().toString(),
        title: titleInput.value.trim(),
        date: dateInput.value,
        time: timeInput.value || "23:59",
        note: noteInput.value.trim(),
      };

      try {
        await fetch(
          isEdit ? "/api/reminders-update.php" : "/api/reminders-create.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reminder),
          }
        );
      } catch (err) {
        console.error("❌ Reminder save error", err);
        return;
      }

      if (this.onSave) {
        this.onSave(reminder);
      }

      this.modal.close();
    };
  }
}
