import Modal from "../ui/Modal.js";
import state from "../core/State.js";

export default class AddEventModal {
  constructor(onSave) {
    this.modal = new Modal();
    this.onSave = onSave;
  }

  open() {
    this.modal.open(`
      <div class="modal-header"><h2>Add Event</h2></div>
      <form class="modal-body" id="event-form">
        <div class="event-types">
          <button type="button" class="event-type selected" data-type="pee">💧 Pee</button>
          <button type="button" class="event-type" data-type="poop">💩 Poop</button>
          <button type="button" class="event-type" data-type="eat">🍴 Eat</button>
        </div>

        <input type="time" name="time" required />
        <input type="text" name="location" placeholder="Location (optional)" />
        <textarea name="comment" placeholder="Comment (optional)"></textarea>

        <div class="modal-actions">
          <button type="submit">Save</button>
          <button type="button" id="cancel">Cancel</button>
        </div>
      </form>
    `);

    this.bind();
  }

  bind() {
    const form = document.getElementById("event-form");
    let type = "pee";

    form.querySelectorAll(".event-type").forEach((btn) => {
      btn.onclick = () => {
        form
          .querySelectorAll(".event-type")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        type = btn.dataset.type;
      };
    });

    document.getElementById("cancel").onclick = () => this.modal.close();

    form.onsubmit = (e) => {
      e.preventDefault();
      const data = new FormData(form);

      state.addEvent({
        id: Date.now(),
        type,
        time: data.get("time"),
        location: data.get("location"),
        comment: data.get("comment"),
        date: state.getSelectedDateString(),
      });

      this.onSave();
      this.modal.close();
    };
  }
}
