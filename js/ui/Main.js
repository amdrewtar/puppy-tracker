import AgeCard from "../components/AgeCard.js";
import EventsList from "../components/EventsList.js";
import AddEventModal from "../components/AddEventModal.js";
import RemindersPanel from "../components/RemindersPanel.js"; // ➕ добавлено
import AddReminderModal from "../components/AddReminderModal.js";

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
          <section>
            <button class="add-event-btn" id="add-event-btn">
                + Add New Event
            </button>
          </section>
          <section id="events-list"></section>
        </div>

        <!-- RIGHT: reminders (1/3) -->
        <aside class="sidebar">
          <!-- сюда монтируем RemindersPanel -->
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

    document.getElementById("add-event-btn").onclick = () => {
      new AddEventModal(() => this.eventsList.render()).open();
    };
  }
}
