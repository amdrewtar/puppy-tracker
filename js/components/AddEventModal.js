import Modal from "../ui/Modal.js";
import state from "../core/State.js";
import Constants from "../core/Constants.js";

export default class AddEventModal {
  constructor(onSave) {
    this.modal = new Modal();
    this.onSave = onSave;
  }

  open() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    this.modal.open(`
      <div class="modal-window">

        <!-- HEADER -->
        <div class="modal-header">
          <h2>Add Event</h2>
          <button class="modal-close" data-action="close">✕</button>
        </div>

        <!-- BODY -->
        <div class="modal-body">

          <h4>Event Type</h4>
          <div class="event-type-grid">
            ${["pee", "poop", "eat"]
              .map(
                (type) => `
              <div class="event-type-card ${
                type === "pee" ? "active" : ""
              }" data-type="${type}">
                ${Constants.EVENT_ICONS[type]}
                <span>${type}</span>
              </div>
            `
              )
              .join("")}
          </div>

          <h4>Time</h4>
          <div class="input-group">
            <span class="input-icon">${Constants.ICONS.CLOCK}</span>
            <input type="time" id="event-time" value="${hh}:${mm}" />
          </div>

          <h4>Location</h4>
          <div class="location-grid">
            <div class="location-card active" data-location="home">
              ${Constants.EVENT_ICONS.HOME}
              <span>Home</span>
            </div>
            <div class="location-card" data-location="street">
              ${Constants.EVENT_ICONS.STREET}
              <span>Street</span>
            </div>
          </div>

          <h4>Comment (optional)</h4>
          <div class="input-group">
            <span class="input-icon">${Constants.ICONS.NOTE}</span>
            <textarea
              id="event-comment"
              placeholder="Add a note..."
              rows="3"
            ></textarea>
          </div>

        </div>

        <!-- FOOTER -->
        <div class="modal-footer">
          <button class="btn-secondary" data-action="cancel">Cancel</button>
          <button class="btn-primary" id="save-event">Save Event</button>
        </div>

      </div>
    `);

    this.bind();
    this.applyEventColors("pee");
  }

  bind() {
    let type = "pee";
    let location = "home";

    // EVENT TYPE
    document.querySelectorAll(".event-type-card").forEach((card) => {
      card.onclick = () => {
        document
          .querySelectorAll(".event-type-card")
          .forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        type = card.dataset.type;
        this.applyEventColors(type);
      };
    });

    // LOCATION
    document.querySelectorAll(".location-card").forEach((card) => {
      card.onclick = () => {
        document
          .querySelectorAll(".location-card")
          .forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        location = card.dataset.location;
      };
    });

    // CLOSE
    document
      .querySelectorAll("[data-action='close'], [data-action='cancel']")
      .forEach((btn) => (btn.onclick = () => this.modal.close()));

    // SAVE
    document.getElementById("save-event").onclick = async () => {
      // ✅ ВАЖНО: берём дату из календаря
      const date = state.getSelectedDateString();

      const payload = {
        date, // 👈 ВОТ ЭТА СТРОКА
        type,
        location,
        time: document.getElementById("event-time").value,
        comment: document.getElementById("event-comment").value.trim(),
      };

      console.log("📦 EVENT JSON:", payload);

      try {
        const res = await fetch("/api/events-create.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        console.log("✅ EVENT SAVED:", json);

        if (!json.success) {
          console.error("❌ Save failed", json);
          return;
        }
      } catch (err) {
        console.error("❌ Request error", err);
        return;
      }

      if (this.onSave) this.onSave();
      this.modal.close();
    };
  }

  applyEventColors(type) {
    const colors = Constants.EVENT_COLORS[type];
    if (!colors) return;

    document.querySelectorAll(".event-type-card").forEach((card) => {
      if (card.dataset.type === type) {
        card.style.borderColor = colors.border;
        card.style.background = colors.bg;
        card.style.color = colors.title;
      } else {
        card.style.borderColor = "";
        card.style.background = "";
        card.style.color = "";
      }
    });
  }
}
