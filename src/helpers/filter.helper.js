// filter.helper.js
const searchFields = {
    'university': ['description'],
    'category': ['title'],
    'direction': ['name'],
    'events': ['name'],
    'eventsCategory': ['name'],
    'faculty': ['name'],
    'news': ['title'],
    'page': ['title'],
    'partner': ['name'],
    'specialistInfo': ['user_id'],
    'user': ['name', 'birthDay', 'passNumber', 'membership', 'login', 'phone', 'password', 'userId', 'role', 'language', 'status', 'action'],
    'language': ['title', 'slug', 'isDefault', 'status'],
    'degree': ['name'],
    'level': ['name'],
};

function buildQuery(model, queryParams) {
    const {search, searchField, filters, dateRange} = queryParams;
    let query = {};

    if (search && typeof search === 'string') {
        console.log(buildTextSearchQuery(model, search, searchField));
        query.$or = buildTextSearchQuery(model, search, searchField);
    }
    if (filters) {
        Object.assign(query, buildFilterQuery(filters));
    }
    if (dateRange) {
        Object.assign(query, buildDateRangeQuery(dateRange));
    }
    return query;
}

function buildTextSearchQuery(model, searchText, searchField) {
    if (!searchFields[model]) {
        return [];
    }
    return searchFields[model].map((field) => {
        if (field === searchField) {
            return {
                [field]: {$regex: new RegExp(searchText.trim(), 'i')}
            }
        }
    });
}

function buildFilterQuery(filters) {
    const query = {};
    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            query[key] = { $in: value };
        } else if (typeof value === 'object' && value !== null) {
            // Handle range queries
            const rangeQuery = {};
            if (value.min !== undefined) rangeQuery.$gte = value.min;
            if (value.max !== undefined) rangeQuery.$lte = value.max;
            query[key] = rangeQuery;
        } else {
            query[key] = value;
        }
    });
    return query;
}

function buildDateRangeQuery(dateRange) {
    const {start, end, field = 'createdAt'} = dateRange;
    const query = {};
    if (start) query[field] = {$gte: new Date(start)};
    if (end) query[field] = {...query[field], $lte: new Date(end)};
    return query;
}

module.exports = {
    buildQuery
};