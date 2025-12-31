import state from "../core/State.js";
import Config from "../core/Config.js";
import {
  addDays,
  formatDate,
  isToday,
  isFuture,
  isSameDay,
  daysDiff,
} from "../utils/date.js";

export default class Calendar {
  constructor(container) {
    this.container = container;
    this.visibleDays = Config.CALENDAR_VISIBLE_DAYS;
  }

  init() {
    // 🔥 ЛОГ ПРИ СТАРТЕ
    console.log("Selected date:", state.getSelectedDate());

    this.render();
    this.bindEvents();
  }

  render() {
    const selectedDate = state.getSelectedDate();
    const startDate = addDays(selectedDate, -2);

    this.container.innerHTML = `
      <div class="calendar-nav">

        <button
          class="nav-btn"
          data-action="first"
          ${this.isFirstDisabled() ? "disabled" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m11 17-5-5 5-5"></path>
            <path d="m18 17-5-5 5-5"></path>
          </svg>
        </button>

        <button
          class="nav-btn"
          data-action="prev"
          ${this.isPrevDisabled() ? "disabled" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>

        <div class="calendar-strip">
          ${this.renderDays(startDate)}
        </div>

        <button
          class="nav-btn"
          data-action="next"
          ${this.isNextDisabled() ? "disabled" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>

        <button
          class="nav-btn"
          data-action="today"
          ${this.isTodayDisabled() ? "disabled" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 17 5-5-5-5"></path>
            <path d="m13 17 5-5-5-5"></path>
          </svg>
        </button>

      </div>
    `;
  }

  renderDays(startDate) {
    return Array.from({ length: this.visibleDays })
      .map((_, index) => {
        const date = addDays(startDate, index);
        const dateStr = formatDate(date);

        const beforeFirst = date < new Date(Config.CALENDAR_FIRST_DAY);

        // 🔥 ОДИН ИСТОЧНИК ИСТИНЫ
        const isDisabled = (!isToday(date) && isFuture(date)) || beforeFirst;

        const classes = [
          "calendar-day",
          isToday(date) ? "today" : "",
          isDisabled ? "disabled" : "",
          isSameDay(date, state.getSelectedDate()) ? "active" : "",
        ].join(" ");

        return `
          <button
            class="${classes}"
            data-date="${dateStr}"
            ${isDisabled ? "disabled" : ""}
          >
            <small>${date.toLocaleDateString("en", {
              weekday: "short",
            })}</small>
            <strong>${date.getDate()}</strong>
            <small>${date.toLocaleDateString("en", { month: "short" })}</small>
          </button>
        `;
      })
      .join("");
  }

  /* ====== disabled logic ====== */

  isPrevDisabled() {
    return isSameDay(state.getSelectedDate(), Config.CALENDAR_FIRST_DAY);
  }

  isFirstDisabled() {
    return daysDiff(state.getSelectedDate(), Config.CALENDAR_FIRST_DAY) <= 1;
  }

  isNextDisabled() {
    return isToday(state.getSelectedDate());
  }

  isTodayDisabled() {
    return daysDiff(new Date(), state.getSelectedDate()) <= 1;
  }

  /* ====== events ====== */

  bindEvents() {
    this.container.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn || btn.disabled) return;

      // 👉 Клик по конкретному дню
      if (btn.dataset.date) {
        const date = new Date(btn.dataset.date);
        state.setSelectedDate(date);

        console.log("📅 Выбран день в календаре:", state.getSelectedDate());

        // 🔔 сообщаем всем, что дата изменилась
        document.dispatchEvent(
          new CustomEvent("calendar:date-changed", {
            detail: {
              date,
              dateString: state.getSelectedDateString(),
            },
          })
        );

        this.render();
        return;
      }

      // 👉 Навигация (prev / next / today / first)
      this.handleNav(btn.dataset.action);
    });
  }

  handleNav(action) {
    const current = state.getSelectedDate();

    switch (action) {
      case "prev":
        state.setSelectedDate(addDays(current, -1));
        break;
      case "next":
        state.setSelectedDate(addDays(current, 1));
        break;
      case "first":
        state.setSelectedDate(new Date(Config.CALENDAR_FIRST_DAY));
        break;
      case "today":
        state.setSelectedDate(new Date());
        break;
    }

    console.log("📅 Навигация календаря, новая дата:", state.getSelectedDate());

    // 🔔 то же событие — единый контракт
    document.dispatchEvent(
      new CustomEvent("calendar:date-changed", {
        detail: {
          date: state.getSelectedDate(),
          dateString: state.getSelectedDateString(),
        },
      })
    );

    this.render();
  }
}
