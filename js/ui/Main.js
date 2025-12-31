import AgeCard from "../components/AgeCard.js";
import EventsList from "../components/EventsList.js";
import AddEventModal from "../components/AddEventModal.js";
import RemindersPanel from "../components/RemindersPanel.js";
import AddReminderModal from "../components/AddReminderModal.js";
import Constants from "../core/Constants.js";

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

          <!-- ADD NEW EVENT CARD -->
          <section>
            <div
              class="add-event-card"
              id="add-event-btn"
              role="button"
              tabindex="0"
            >
              <div class="add-event-inner">
                <span class="add-event-icon">
                  ${Constants.ICONS.PLUS}
                </span>
                <span class="add-event-text">
                  Add New Event
                </span>
              </div>
            </div>
          </section>

          <section id="events-list"></section>
        </div>

        <!-- RIGHT: reminders (1/3) -->
        <aside class="sidebar">
          <div id="reminders-root"></div>
        </aside>

      </div>
    `;

    // ===== init components =====

    this.ageCard = new AgeCard(document.getElementById("age-card"));
    this.eventsList = new EventsList(document.getElementById("events-list"));
    this.reminders = new RemindersPanel(
      document.getElementById("reminders-root")
    );

    this.ageCard.render();
    this.eventsList.render();
    this.reminders.render();

    // ===== ADD EVENT =====

    document.getElementById("add-event-btn").onclick = () => {
      new AddEventModal(() => this.eventsList.render()).open();
    };
  }
}
