const Config = {
  STORAGE_KEYS: {
    PUPPY: "puppyInfo",
    EVENTS: "events",
    REMINDERS: "reminders",
  },

  DEFAULT_PUPPY: {
    name: "Buddy",
    birthday: "2025-07-25",
    adoptionDate: "2025-09-27",
  },

  EVENT_TYPES: ["pee", "poop", "eat"],
  LOCATIONS: ["house", "street"],

  CALENDAR_VISIBLE_DAYS: 5,

  /* ===== DERIVED CONFIG (single source of truth) ===== */
  get CALENDAR_FIRST_DAY() {
    return new Date(this.DEFAULT_PUPPY.adoptionDate);
  },
};

export default Config;
