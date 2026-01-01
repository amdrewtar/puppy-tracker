import state from "../core/State.js";
import Constants from "../core/Constants.js";
import AddEventModal from "./AddEventModal.js";

export default class EventsList {
  constructor(root) {
    this.root = root;

    document.addEventListener("calendar:date-changed", () => {
      this.render();
    });
  }

  async render() {
    const date = state.getSelectedDateString();
    if (!date) return;

    try {
      const res = await fetch("/api/events-get.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });

      const data = await res.json();
      const events = Array.isArray(data) ? data : [];

      events.sort((a, b) => (b.time || "").localeCompare(a.time || ""));

      this.currentEvents = events;

      this.root.innerHTML = `
        <section class="events-card">
          <header class="events-header">
            <h3>Today Events</h3>
          </header>

          <div class="events-body">
            ${
              events.length
                ? events.map((e, i) => this.renderItem(e, i)).join("")
                : this.renderEmpty()
            }
          </div>
        </section>
      `;

      this.bind();
    } catch (err) {
      console.error("❌ Ошибка загрузки событий:", err);
    }
  }

  renderItem(event, index) {
    const colors = Constants.EVENT_COLORS[event.type];
    const icon = Constants.EVENT_ICONS[event.type];

    return `
      <div
        class="event-item"
        data-id="${event.id}"
        style="
          background:${colors.bg};
          border:1px solid ${colors.border};
          animation-delay:${index * 0.06}s;
        "
      >

        <!-- ACTIONS -->
        <div class="event-actions">
          <button
            class="event-edit"
            data-action="edit"
            title="Edit event"
          >
            ${Constants.ICONS.EDIT}
          </button>

          <button
            class="event-delete"
            data-action="delete"
            title="Delete event"
          >
            ${Constants.ICONS.DELETE}
          </button>
        </div>

        <!-- ICON -->
        <div
          class="event-icon event-icon-main"
          style="background:#fff;color:${colors.title};"
        >
          ${icon}
        </div>

        <!-- CONTENT -->
        <div class="event-content">

          <div class="event-row event-row-main">
            <span class="event-time" style="color:${colors.title}">
              ${event.time}
            </span>

            ${
              event.location
                ? `
                  <span class="event-location">
                    <span class="event-icon event-icon-meta">
                      ${Constants.EVENT_ICONS[event.location.toUpperCase()]}
                    </span>
                    <span>${event.location}</span>
                  </span>
                `
                : ""
            }

            ${
              event.type === "eat" && event.grams
                ? `
                  <span class="event-location">
                    <span class="event-icon event-icon-meta">
                      ${Constants.EVENT_ICONS.EAT}
                    </span>
                    <span>${event.grams} g</span>
                  </span>
                `
                : ""
            }
          </div>

          ${
            event.comment
              ? `
                <div class="event-row event-row-secondary">
                  <span class="event-icon event-icon-meta">
                    ${Constants.ICONS.NOTE}
                  </span>
                  <span class="event-comment">
                    ${event.comment}
                  </span>
                </div>
              `
              : ""
          }
        </div>
      </div>
    `;
  }

  renderEmpty() {
    return `
      <div class="events-empty">
        <div class="events-empty-icon">🐾</div>
        <p>No events for this day</p>
      </div>
    `;
  }

  bind() {
    this.root.onclick = async (e) => {
      // ================= DELETE =================
      const deleteBtn = e.target.closest("[data-action='delete']");
      if (deleteBtn) {
        e.stopPropagation();

        const item = deleteBtn.closest(".event-item");
        if (!item) return;

        const id = item.dataset.id;
        if (!id) return;

        item.classList.add("removing");

        try {
          await fetch("/api/events-delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
        } catch (err) {
          console.error("❌ Event delete failed", err);
          item.classList.remove("removing");
          return;
        }

        setTimeout(() => {
          item.remove();

          const body = this.root.querySelector(".events-body");
          if (!body.querySelector(".event-item")) {
            body.innerHTML = this.renderEmpty();
          }
        }, 280);

        return;
      }

      // ================= EDIT =================
      const editBtn = e.target.closest("[data-action='edit']");
      if (editBtn) {
        e.stopPropagation();

        const item = editBtn.closest(".event-item");
        if (!item) return;

        const id = item.dataset.id;
        if (!id) return;

        const event = this.currentEvents.find((e) => e.id == id);
        if (!event) return;

        const modal = new AddEventModal(() => this.render(), event);
        modal.open();
      }
    };
  }
}
