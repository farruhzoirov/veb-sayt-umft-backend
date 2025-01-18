// Universal crud bilan ishlash uchun va mongodbdan mos modellarni, populatelarni olish uchun kerakli ikkita obyektlar

const Model = {
  university: {ref: "university", translate: true},
  category: {ref: "category", translate: true},
  employee: {ref: "employee", translate: true, populate: ["department"]},
  socials: {ref: "socials", translate: false},
  specialty: {ref: "specialty", translate: true, populate: ["department", "degree"]},
  topic: {ref: "topic", translate: true, populate: ["specialty", "level"]},
  theme: {ref: "theme", translate: true, populate: ["topic"]},
  department: {ref: "department", translate: true},
  events: {ref: "events", translate: true, populate: ["eventsCategory"]},
  eventsCategory: {ref: "eventsCategory", translate: true},
  news: {ref: "news", translate: true, populate: ["category"]},
  page: {ref: "page", translate: true},
  partner: {ref: "partner", translate: true},
  degree: {ref: "degree", translate: true},
  level: {ref: "level", translate: false},
  format: {ref: "format", translate: true},
  messenger: {ref: "messenger", translate: true},
  contact: {ref: "contact", translate: false},
  user: {ref: "user", translate: true},
  language: {ref: "language", translate: false},
  contacts: {ref: "contacts", translate: false},
  licence: {ref: "licence", translate: false},
  social: {ref: "social", translate: true, populate: ["messenger"]}
};

const TranslateModel = {
  university: {ref: "universityTranslate"},
  category: {ref: "categoryTranslate"},
  employee: {ref: "employeeTranslate"},
  specialty: {ref: "specialtyTranslate"},
  department: {ref: "departmentTranslate"},
  events: {ref: "eventsTranslate"},
  eventsCategory: {ref: "eventsCategoryTranslate"},
  news: {ref: "newsTranslate"},
  page: {ref: "pageTranslate"},
  partner: {ref: "partnerTranslate"},
  format: {ref: "formatTranslate"},
  degree: {ref: "degreeTranslate"},
  topic: {ref: "topicTranslate"},
  theme: {ref: "themeTranslate"},
  messenger: {ref: "messengerTranslate"},
  user: {ref: "userTranslate"},
  social: {ref: "socialTranslate"}
};


module.exports = {
  Model: Model,
  TranslateModel: TranslateModel,
};
