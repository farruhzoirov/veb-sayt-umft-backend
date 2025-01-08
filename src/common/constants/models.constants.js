// Universal crud bilan ishlash uchun va mongodbdan mos modellarni, populatelarni olish uchun kerakli ikkita obyektlar

const Model = {
    university: {ref: "university", translate: true},
    category: {ref: "category", translate: true},
    employee: {ref: "employee", translate: true, populate: ["department, socialLinks"]},
    specialty: {
        ref: "specialty",
        translate: true,
        populate: ["department", "degree"],
    },
    specialistInfo: {
        ref: "specialistInfo",
        translate: true,
        populate: ["user"],
    },
    topic: {ref: "topic", translate: true, populate: ["specialty", "level"]},
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
    specialistInfo: {ref: "specialistInfoTranslate"},
    format: {ref: "formatTranslate"},
    degree: {ref: "degreeTranslate"},
    topic: {ref: "topicTranslate"},
    messenger: {ref: "messengerTranslate"},
    user: {ref: "userTranslate"},
};


module.exports = {
    Model: Model,
    TranslateModel: TranslateModel,
};
