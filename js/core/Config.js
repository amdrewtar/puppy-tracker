const Config = {
  STORAGE_KEYS: {
    PUPPY: "puppyInfo",
    EVENTS: "events",
    REMINDERS: "reminders",
  },

  DEFAULT_PUPPY: {
    name: "Buddy",
    birthday: "2024-10-01",
    adoptionDate: "2024-11-15",
  },

  EVENT_TYPES: ["pee", "poop", "eat"],
  LOCATIONS: ["house", "street"],

  CALENDAR_VISIBLE_DAYS: 5,

  // ➕ добавлено
  CALENDAR_FIRST_DAY: new Date("2025-09-27"),
};

export default Config;
