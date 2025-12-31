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
    HOME: "home",
    STREET: "street",
  },

  EVENT_ICONS: {
    pee: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplet w-6 h-6 mx-auto mb-1 text-blue-500" data-fg-dvrp18="1.30:1.7488:/src/app/components/AddEventModal.tsx:80:19:2796:105:e:Droplet::::::ChjX"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>',
    poop: "💩",
    eat: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-crossed w-6 h-6 mx-auto mb-1 text-gray-400" data-fg-dvrp27="1.30:1.7488:/src/app/components/AddEventModal.tsx:102:19:3930:114:e:UtensilsCrossed::::::Cm7h"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path><path d="m2.1 21.8 6.4-6.3"></path><path d="m19 5-7 7"></path></svg>',
    HOME: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house w-6 h-6 mx-auto mb-1 text-purple-500" data-fg-dvrp42="1.30:1.7488:/src/app/components/AddEventModal.tsx:132:21:5266:106:e:House::::::pfz"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>',
    STREET:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin w-6 h-6 mx-auto mb-1 text-gray-400" data-fg-dvrp46="1.30:1.7488:/src/app/components/AddEventModal.tsx:143:21:5865:108:e:MapPin::::::EHMc"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  },

  EVENT_COLORS: {
    pee: {
      border: "#bedbff",
      bg: "#e5f0ff",
      title: "#193cb8",
      text: "#5288fc",
    },
    eat: {
      border: "#b9f8cf",
      bg: "#edfdf2",
      title: "#016630",
      text: "#51aa75",
    },
    poop: {
      border: "#feea9d",
      bg: "#fff7d9",
      title: "#973c00",
      text: "#e78f32",
    },
  },

  CALENDAR: {
    VISIBLE_DAYS: 5,
  },
};

export default Constants;
