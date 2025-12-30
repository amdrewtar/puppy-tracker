const Constants = {
  APP_ICON: "🐶",

  ICONS: {
    REMINDER:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell w-6 h-6 text-purple-500" data-fg-bea39="1.33:1.5423:/src/app/components/AddReminderModal.tsx:64:17:1823:44:e:Bell::::::CmDo"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>',
    EDIT: "✏️",
    CALENDAR:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar absolute left-3 top-3 w-5 h-5 text-gray-400" data-fg-bea324="1.33:1.5423:/src/app/components/AddReminderModal.tsx:91:17:2941:68:e:Calendar::::::CjND"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>',
    CLOCK:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock absolute left-3 top-3 w-5 h-5 text-gray-400" data-fg-bea331="1.33:1.5423:/src/app/components/AddReminderModal.tsx:105:17:3562:65:e:Clock::::::B2HF"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    NOTE: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle absolute left-3 top-3 w-5 h-5 text-gray-400" data-fg-bea338="1.33:1.5423:/src/app/components/AddReminderModal.tsx:119:17:4183:73:e:MessageCircle::::::OJK"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>',
    PLUS: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" data-fg-tsl5="1.39:1.3728:/src/app/components/RemindersSection.tsx:40:11:1264:87:e:Plus::::::MOt"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>',
    NONE: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target w-4 h-4 text-blue-600" data-fg-cx6k39="1.42:1.19389:/src/app/components/HistoryModal.tsx:206:25:7219:44:e:Target::::::B7YE"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
  },

  EVENT_TYPES: {
    PEE: "pee",
    POOP: "poop",
    EAT: "eat",
  },

  EVENT_ICONS: {
    pee: "💧",
    poop: "💩",
    eat: "🍴",
  },

  EVENT_COLORS: {
    pee: "#3b82f6",
    poop: "#f59e0b",
    eat: "#10b981",
  },

  CALENDAR: {
    VISIBLE_DAYS: 5,
  },
};

export default Constants;
