import Modal from "../ui/Modal.js";
import Constants from "../core/Constants.js";

export default class HistoryStatsModal {
  constructor() {
    this.modal = new Modal();
    this.currentPeriod = "Today";
    this.statsData = null;
  }

  open() {
    this.modal.open(`
      <div class="modal-window">

        <!-- HEADER -->
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-icon">${Constants.ICONS.HISTORY}</div>
            <h2>History & Statistics</h2>
            <button class="modal-close" data-action="close">✕</button>
          </div>
        </div>

        <!-- BODY -->
        <div class="modal-body stats-body">
          <div class="quick-select stats-select">
            ${["Today", "Last 7 days", "All Time"]
              .map(
                (label, i) => `
                  <button
                    class="quick-select-btn ${i === 0 ? "active" : ""}"
                    data-period="${label}"
                  >
                    ${label}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>

        <!-- FOOTER -->
        <div class="stats-footer">
          ${["pee", "poop", "eat"]
            .map((type) => this.renderStatsBlock(type))
            .join("")}
        </div>

      </div>
    `);

    this.bind();
    this.loadStats(this.currentPeriod);
  }

  // =====================================================
  // 📡 LOAD STATS
  // =====================================================
  async loadStats(period) {
    try {
      const res = await fetch("/api/stats-get.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period }),
      });

      const data = await res.json();
      console.log("📊 STATS RESPONSE:", data);

      this.statsData = data.result;
      this.updateUI();
    } catch (e) {
      console.error("❌ Stats load failed", e);
    }
  }

  // =====================================================
  // 🔁 UPDATE UI
  // =====================================================
  updateUI() {
    if (!this.statsData) return;

    ["pee", "poop", "eat"].forEach((type) => {
      const data = this.statsData[type];
      if (!data) return;

      const colors = Constants.EVENT_COLORS[type];

      const card = this.modal.root.querySelector(
        `.stats-card[data-type="${type}"]`
      );
      if (!card) return;

      const values = card.querySelectorAll(".stats-item-value");

      // TOTAL
      values[0].textContent = data.total ?? 0;

      // AVERAGE (backend уже всё решил)
      values[1].textContent = data.average ?? 0;

      // LOCATIONS / WEIGHT
      if (type === "eat") {
        const mini = card.querySelector(".stats-mini");
        if (mini) mini.textContent = `${data.weight_kg ?? 0} kg`;
      } else {
        const spans = card.querySelectorAll(".stats-mini span");
        if (spans.length >= 2) {
          spans[0].textContent = ` ${data.locations?.home ?? 0} `;
          spans[1].textContent = ` ${data.locations?.street ?? 0}`;
        }
      }

      // ===============================
      // ⏱ AVG DETAILS
      // ===============================
      const label = card.querySelector(
        ".stats-item:last-child .stats-item-label"
      );
      const list = card.querySelector(".stats-times-list");

      const times = Object.values(data.times_day || {});

      if (label) {
        label.textContent = `~${data.average ?? 0} times/day on avg`;
      }

      if (list) {
        list.innerHTML = "";

        if (!times.length) {
          list.insertAdjacentHTML(
            "beforeend",
            `
            <div class="stats-item-row">
              <span class="stats-item-sub" style="color:${colors.text}">
                1. time:
              </span>
              <span
                class="stats-item-value stats-item-value-small"
                style="color:${colors.title}"
              >
                --:--
              </span>
            </div>
          `
          );
        } else {
          times.forEach((time, index) => {
            list.insertAdjacentHTML(
              "beforeend",
              `
              <div class="stats-item-row">
                <span
                  class="stats-item-sub"
                  style="color:${colors.text}"
                >
                  ${index + 1}. time:
                </span>

                <span
                  class="stats-item-value stats-item-value-small"
                  style="color:${colors.title}"
                >
                  ${time}
                </span>
              </div>
            `
            );
          });
        }
      }
    });
  }

  // =====================================================
  // 📊 STATS BLOCK
  // =====================================================
  renderStatsBlock(type) {
    const colors = Constants.EVENT_COLORS[type];
    const icon = Constants.EVENT_ICONS[type];

    return `
      <div
        class="stats-card"
        data-type="${type}"
        style="background:${colors.bg}; border-color:${colors.border};"
      >
        <div class="stats-card-header">
          <div class="stats-icon" style="color:${colors.title}">
            ${icon}
          </div>

          <div class="stats-title">
            <div style="color:${colors.title}">
              ${type.toUpperCase()}
            </div>
            <small style="color:${colors.sub_title}">
              Statistics
            </small>
          </div>
        </div>

        <div class="stats-items">
          ${this.renderStatItem(Constants.ICONS.NONE, "Total", "0", colors)}
          ${this.renderStatItem(
            Constants.ICONS.AVERAGE,
            "Average",
            "0",
            colors
          )}
          ${this.renderLocationsItem(colors, type)}
          ${this.renderAvgDetailsItem(colors)}
        </div>
      </div>
    `;
  }

  // =====================================================
  // 📍 LOCATIONS / WEIGHT
  // =====================================================
  renderLocationsItem(colors, type) {
    return `
      <div class="stats-item" style="background:rgba(255,255,255,0.6);">
        <div class="stats-item-icon" style="color:${colors.text}">
          ${
            type === "eat"
              ? Constants.EVENT_ICONS.EAT
              : Constants.EVENT_ICONS.STREET
          }
        </div>

        <div class="stats-item-content">
          <div class="stats-item-label" style="color:${colors.title}">
            ${type === "eat" ? "Weight" : "Locations"}
          </div>

          <div class="stats-item-value" style="color:${colors.text}">
            <div class="stats-mini">
              ${
                type === "eat"
                  ? `0 kg`
                  : `
                    ${Constants.EVENT_ICONS.HOME}<span> 0 </span>
                    ${Constants.EVENT_ICONS.STREET}<span> 0</span>
                  `
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =====================================================
  // ⏱ AVG DETAILS
  // =====================================================
  renderAvgDetailsItem(colors) {
    return `
      <div class="stats-item" style="background:rgba(255,255,255,0.6);">
        <div class="stats-item-icon" style="color:${colors.text}">
          ${Constants.ICONS.TIMEDAY}
        </div>

        <div class="stats-item-content">
          <div class="stats-item-label" style="color:${colors.title}">
            ~0 times/day on avg
          </div>

          <div class="stats-times-list"></div>
        </div>
      </div>
    `;
  }

  // =====================================================
  // 🧱 DEFAULT ITEM
  // =====================================================
  renderStatItem(icon, label, value, colors) {
    return `
      <div class="stats-item" style="background:rgba(255,255,255,0.6);">
        <div class="stats-item-icon" style="color:${colors.text}">
          ${icon}
        </div>

        <div class="stats-item-content">
          <div class="stats-item-label" style="color:${colors.title}">
            ${label}
          </div>

          <div class="stats-item-value" style="color:${colors.title}">
            ${value}
          </div>
        </div>
      </div>
    `;
  }

  // =====================================================
  // EVENTS
  // =====================================================
  bind() {
    this.modal.root
      .querySelectorAll("[data-action='close']")
      .forEach((btn) => (btn.onclick = () => this.modal.close()));

    this.modal.root.querySelectorAll(".quick-select-btn").forEach((btn) => {
      btn.onclick = () => {
        this.modal.root
          .querySelectorAll(".quick-select-btn")
          .forEach((b) => b.classList.remove("active"));

        btn.classList.add("active");
        this.currentPeriod = btn.dataset.period;
        this.loadStats(this.currentPeriod);
      };
    });
  }
}
