const searchFields = {
    category: ["title"],
    specialty: ["name"],
    events: ["name"],
    eventsCategory: ["name"],
    department: ["name"],
    news: ["title"],
    page: ["title"],
    partner: ["name"],
    employee: ["fullName"],
    user: ["name"],
    language: ["title"],
    degree: ["name"],
    level: ["name"],
    messenger: ["name"],
    theme: ["name"],
    topic: ["name"],
};


function buildQuery(model, search) {
    let query = {};
    if (search && typeof search === "string") {
        query.$or = buildTextSearchQuery(model, search);
    }
    return query;
}

function buildTextSearchQuery(model, searchText) {
    if (!searchFields[model]) {
        return [];
    }
    return searchFields[model].map((field) => {
        return {
            [field]: {$regex: new RegExp(searchText.trim(), "i")},
        };
    });
}

module.exports = {
    buildQuery,
};
