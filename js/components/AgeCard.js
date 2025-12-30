import state from "../core/State.js";
import Constants from "../core/Constants.js";

export default class AgeCard {
  constructor(root) {
    this.root = root;
  }

  render() {
    const puppy = state.getPuppy();
    const birthDate = new Date(puppy.birthday);
    const today = new Date();

    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
      days += prevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const ageTextParts = [];
    if (years > 0) ageTextParts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0)
      ageTextParts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (years === 0 && days > 0)
      ageTextParts.push(`${days} day${days > 1 ? "s" : ""}`);

    const ageText = ageTextParts.join(" and ");

    this.root.innerHTML = `
      <div class="card age-card">
        <div class="age-row">
          <div class="age-icon">${Constants.APP_ICON}</div>
          <div class="age-text">
            <h3>Puppy's Age</h3>
            <div class="age-value">${ageText} old</div>
          </div>
        </div>
      </div>
    `;
  }
}
