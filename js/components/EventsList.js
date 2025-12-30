import state from "../core/State.js";
import Constants from "../core/Constants.js";

export default class EventsList {
  constructor(root) {
    this.root = root;
  }

  render() {
    const events = state.getEventsByDate(state.getSelectedDateString());

    if (!events.length) {
      this.root.innerHTML = `
        <div class="card">
          🐾 No events today
        </div>
      `;
      return;
    }

    this.root.innerHTML = `
      <div class="card">
        <h3>Today's Events</h3>
        ${events
          .map(
            (e) => `
          <div>
            ${Constants.EVENT_ICONS[e.type]} ${e.time} ${e.comment || ""}
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
}
