const Model = {
    'university': { ref: 'university', translate: true },
    'category': { ref: 'category', translate: true },
    'direction': { ref: 'direction', translate: true, populate: ['faculty', 'degree', 'format'] },
    'events': { ref: 'events', translate: true, populate: ['eventsCategory'] },
    'eventsCategory': { ref: 'eventsCategory', translate: true},
    'faculty': { ref: 'faculty', translate: true },
    'news': { ref: 'news', translate: true, populate: ['category'] },
    'page': { ref: 'page', translate: true },
    'partners': { ref: 'partners', translate: true },
    'specialistInfo': { ref: 'specialistInfo', translate: true, populate: ['user_id'] },
    'degree': { ref: 'degree', translate: true },
    'level': { ref: 'level', translate: true },
    'format': { ref: 'format', translate: true },
    'topic': { ref: 'topic', translate: true },
    'user': { ref: 'User', translate: false },
    'language': { ref: 'language', translate: false },
};


const TranslateModel = {
    'university': { ref: 'universityTranslate' },
    'category': { ref: 'categoryTranslate' },
    'direction': { ref: 'directionTranslate' },
    'events': { ref: 'eventsTranslate' },
    'eventsCategory': { ref: 'eventsCategoryTranslate' },
    'faculty': { ref: 'facultyTranslate' },
    'news': { ref: 'newsTranslate' },
    'page': { ref: 'pageTranslate' },
    'partners': { ref: 'partnerTranslate' },
    'specialistInfo': { ref: 'specialistInfoTranslate' },
    'format': { ref: 'formatTranslate' },
    'degree': { ref: 'degreeTranslate' },
    'level': { ref: 'levelTranslate' },
    'topic': { ref: 'topicTranslate' },
};


module.exports = {
    Model: Model,
    TranslateModel: TranslateModel,
}