import Modal from "../ui/Modal.js";
import state from "../core/State.js";
import Constants from "../core/Constants.js";

export default class AddEventModal {
  constructor(onSave, event = null) {
    this.modal = new Modal();
    this.onSave = onSave;
    this.event = event; // null = create, object = edit
  }

  open() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    const isEdit = !!this.event;
    const hhmm = isEdit ? this.event.time : `${hh}:${mm}`;

    this.modal.open(`
      <div class="modal-window">

        <!-- HEADER -->
        <div class="modal-header">
          <h2>${isEdit ? "Edit Event" : "Add Event"}</h2>
          <button class="modal-close" data-action="close">✕</button>
        </div>

        <!-- BODY -->
        <div class="modal-body">

          <h4>Event Type</h4>
          <div class="event-type-grid">
            ${["pee", "poop", "eat"]
              .map(
                (type) => `
              <div class="event-type-card" data-type="${type}">
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
            <input type="time" id="event-time" value="${hhmm}" />
          </div>

          <!-- LOCATION -->
          <div id="event-location-block">
            <h4>Location</h4>
            <div class="location-grid">
              <div class="location-card" data-location="home">
                ${Constants.EVENT_ICONS.HOME}
                <span>Home</span>
              </div>
              <div class="location-card" data-location="street">
                ${Constants.EVENT_ICONS.STREET}
                <span>Street</span>
              </div>
            </div>
          </div>

          <!-- FOOD -->
          <div id="event-grams-block" style="display:none">
            <h4>Food amount</h4>
            <div class="input-group">
              <span class="input-icon">${Constants.ICONS.NOTE}</span>
              <input
                type="number"
                id="event-grams"
                placeholder="grams"
                min="1"
              />
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
          <button class="btn-primary" id="save-event">
            ${isEdit ? "Save Changes" : "Save Event"}
          </button>
        </div>

      </div>
    `);

    this.bind();

    // init default
    this.applyEventColors("pee");
    this.toggleLocationVisibility("pee");
    this.toggleGramsVisibility("pee");

    // fill data if edit
    if (this.event) {
      this.fillForm();
    }
  }

  bind() {
    let type = this.event?.type || "pee";
    let location = this.event?.location || "home";

    // EVENT TYPE
    document.querySelectorAll(".event-type-card").forEach((card) => {
      card.onclick = () => {
        document
          .querySelectorAll(".event-type-card")
          .forEach((c) => c.classList.remove("active"));

        card.classList.add("active");
        type = card.dataset.type;

        this.applyEventColors(type);
        this.toggleLocationVisibility(type);
        this.toggleGramsVisibility(type);
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
      const payload = {
        id: this.event?.id,
        date: state.getSelectedDateString(),
        type,
        time: document.getElementById("event-time").value,
        comment: document.getElementById("event-comment").value.trim(),
      };

      if (type !== "eat") {
        payload.location = location;
      }

      if (type === "eat") {
        const grams = document.getElementById("event-grams").value;
        if (grams) payload.grams = parseInt(grams, 10);
      }

      const url = this.event
        ? "/api/events-update.php"
        : "/api/events-create.php";

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
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

  fillForm() {
    const e = this.event;

    document.querySelector(`.event-type-card[data-type="${e.type}"]`)?.click();

    if (e.location) {
      document
        .querySelector(`.location-card[data-location="${e.location}"]`)
        ?.click();
    }

    if (e.grams) {
      const grams = document.getElementById("event-grams");
      if (grams) grams.value = e.grams;
    }

    const comment = document.getElementById("event-comment");
    if (comment) comment.value = e.comment || "";
  }

  toggleLocationVisibility(type) {
    const block = document.getElementById("event-location-block");
    if (block) block.style.display = type === "eat" ? "none" : "";
  }

  toggleGramsVisibility(type) {
    const block = document.getElementById("event-grams-block");
    if (block) block.style.display = type === "eat" ? "" : "none";
  }

  applyEventColors(type) {
    const colors = Constants.EVENT_COLORS[type];
    if (!colors) return;

    document.querySelectorAll(".event-type-card").forEach((card) => {
      if (card.dataset.type === type) {
        card.classList.add("active");
        card.style.borderColor = colors.border;
        card.style.background = colors.bg;
        card.style.color = colors.title;
      } else {
        card.classList.remove("active");
        card.style.borderColor = "";
        card.style.background = "";
        card.style.color = "";
      }
    });
  }
}
