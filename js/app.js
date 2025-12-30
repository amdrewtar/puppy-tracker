import Header from "./ui/Header.js";
import Main from "./ui/Main.js";

class App {
  constructor() {
    this.headerRoot = document.getElementById("app-header");
    this.mainRoot = document.getElementById("app-root");
  }

  init() {
    this.renderHeader();
    this.renderMain();
  }

  renderHeader() {
    const header = new Header(this.headerRoot);
    header.render();
  }

  renderMain() {
    const main = new Main(this.mainRoot);
    main.init();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
