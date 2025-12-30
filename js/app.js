import Header from "./ui/Header.js";

class App {
  constructor() {
    this.headerRoot = document.getElementById("app-header");
  }

  init() {
    this.renderHeader();
  }

  renderHeader() {
    const header = new Header(this.headerRoot);
    header.render();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
