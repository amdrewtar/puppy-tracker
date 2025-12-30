import AgeCard from "../components/AgeCard.js";
import EventsList from "../components/EventsList.js";
import AddEventModal from "../components/AddEventModal.js";

export default class Main {
  constructor(root) {
    this.root = root;
  }

  init() {
    this.root.innerHTML = `
      <section id="age-card"></section>
      <button class="card-add" id="add-event-btn">+ Add New Event</button>
      <section id="events-list"></section>
    `;

    this.ageCard = new AgeCard(document.getElementById("age-card"));
    this.eventsList = new EventsList(document.getElementById("events-list"));

    this.ageCard.render();
    this.eventsList.render();

    document.addEventListener("dateChange", () => {
      this.eventsList.render();
    });

    document.getElementById("add-event-btn").onclick = () => {
      new AddEventModal(() => this.eventsList.render()).open();
    };
  }
}
