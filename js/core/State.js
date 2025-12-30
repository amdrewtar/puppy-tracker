import Config from "./Config.js";
import Storage from "./Storage.js";
import { formatDate } from "../utils/date.js";

class State {
  constructor() {
    this.selectedDate = new Date();

    this.puppyInfo = Storage.load(
      Config.STORAGE_KEYS.PUPPY,
      Config.DEFAULT_PUPPY
    );

    this.events = Storage.load(Config.STORAGE_KEYS.EVENTS, []);
    this.reminders = Storage.load(Config.STORAGE_KEYS.REMINDERS, []);
  }

  /* ================= DATE ================= */

  getSelectedDate() {
    return this.selectedDate;
  }

  setSelectedDate(date) {
    this.selectedDate = date;
  }

  getSelectedDateString() {
    return formatDate(this.selectedDate);
  }

  /* ================= EVENTS ================= */

  getEvents() {
    return this.events;
  }

  getEventsByDate(dateString) {
    return this.events
      .filter((e) => e.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  addEvent(event) {
    this.events.push(event);
    Storage.save(Config.STORAGE_KEYS.EVENTS, this.events);
  }

  /* ================= REMINDERS ================= */

  getReminders() {
    return this.reminders;
  }

  addReminder(reminder) {
    this.reminders.push(reminder);
    Storage.save(Config.STORAGE_KEYS.REMINDERS, this.reminders);
  }

  /* ================= PUPPY ================= */

  getPuppy() {
    return this.puppyInfo;
  }

  setPuppy(info) {
    this.puppyInfo = info;
    Storage.save(Config.STORAGE_KEYS.PUPPY, info);
  }
}

const state = new State();
export default state;
