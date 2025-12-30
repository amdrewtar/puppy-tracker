export default class Modal {
  constructor() {
    this.root = document.getElementById("modal-root");
  }

  open(content) {
    this.root.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-window">
          ${content}
        </div>
      </div>
    `;

    // закрытие по клику на фон
    this.root.querySelector(".modal-overlay").onclick = (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        this.close();
      }
    };

    // esc
    document.onkeydown = (e) => {
      if (e.key === "Escape") this.close();
    };
  }

  close() {
    this.root.innerHTML = "";
    document.onkeydown = null;
  }
}
