export default class Storage {
  static load(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error(`Storage load error: ${key}`, e);
      return fallback;
    }
  }

  static save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Storage save error: ${key}`, e);
    }
  }

  static clear(key) {
    localStorage.removeItem(key);
  }
}
