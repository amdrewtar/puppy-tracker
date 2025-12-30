export default class AgeCard {
  constructor(root) {
    this.root = root;
  }

  render() {
    this.root.innerHTML = `
      <div class="card">
        <strong>🐶 Puppy's Age</strong>
        <div>Age calculation later</div>
      </div>
    `;
  }
}
