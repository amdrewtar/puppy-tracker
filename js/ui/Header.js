import Calendar from "../components/Calendar.js";
import Constants from "../core/Constants.js";

export default class Header {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <div class="header">

        <div class="header-left">
          <div class="header-logo">${Constants.APP_ICON}</div>
          <div class="header-title">
            <h1>Puppy Tracker</h1>
            <small>Puppy Life Diary</small>
          </div>
        </div>

        <div class="header-center" id="calendar-root"></div>

        <div class="header-right">
          <button class="stats-button">
            History & Statistics
          </button>
        </div>

      </div>
    `;

    this.initCalendar();
  }

  initCalendar() {
    const calendarRoot = this.container.querySelector("#calendar-root");
    const calendar = new Calendar(calendarRoot);
    calendar.init();
  }
}
