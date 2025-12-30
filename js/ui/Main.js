import AgeCard from "../components/AgeCard.js";
import EventsList from "../components/EventsList.js";
import AddEventModal from "../components/AddEventModal.js";

export default class Main {
  constructor(root) {
    this.root = root;
  }

  init() {
    this.root.innerHTML = `
      <div class="main-layout">

        <!-- LEFT: main content (2/3) -->
        <div class="main-content">
          <section id="age-card"></section>

          <button class="add-event-btn" id="add-event-btn">
            + Add New Event
          </button>

          <section id="events-list"></section>
        </div>

        <!-- RIGHT: reminders (1/3) -->
        <aside class="sidebar">
          <div class="card reminders-card">
            <h3>🔔 Reminders</h3>
            <p>Coming soon</p>
          </div>
        </aside>

      </div>
    `;

    this.ageCard = new AgeCard(document.getElementById("age-card"));
    this.eventsList = new EventsList(document.getElementById("events-list"));

    this.ageCard.render();
    this.eventsList.render();

    document.getElementById("add-event-btn").onclick = () => {
      new AddEventModal(() => this.eventsList.render()).open();
    };
  }
}
