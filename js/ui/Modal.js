export default class Modal {
  open(html) {
    const root = document.getElementById("modal-root");
    root.innerHTML = `
      <div class="modal-overlay">
        <div class="modal">${html}</div>
      </div>
    `;
    root.classList.remove("hidden");

    root.onclick = (e) => {
      if (e.target.classList.contains("modal-overlay")) this.close();
    };

    document.onkeydown = (e) => {
      if (e.key === "Escape") this.close();
    };
  }

  close() {
    const root = document.getElementById("modal-root");
    root.classList.add("hidden");
    root.innerHTML = "";
  }
}
