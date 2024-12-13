const Model = {
  'university': {ref: 'university', translate: true},
  'category': {ref: 'category', translate: true},
  'specialty': {ref: 'specialty', translate: true, populate: ['department', 'degree', 'format']},
  'department': {ref: 'department', translate: true},
  'events': {ref: 'events', translate: true, populate: ['eventsCategory']},
  'eventsCategory': {ref: 'eventsCategory', translate: true},
  'news': {ref: 'news', translate: true, populate: ['category']},
  'page': {ref: 'page', translate: true},
  'partners': {ref: 'partners', translate: true},
  'specialistInfo': {ref: 'specialistInfo', translate: true, populate: ['user']},
  'degree': {ref: 'degree', translate: true},
  'level': {ref: 'level', translate: false},
  'format': {ref: 'format', translate: true},
  'topic': {ref: 'topic', translate: true},
  'messenger': {ref: 'messenger', translate: true},
  'user': {ref: 'user', translate: true},
  'language': {ref: 'language', translate: false},
};


const TranslateModel = {
  'university': {ref: 'universityTranslate'},
  'category': {ref: 'categoryTranslate'},
  'specialty': {ref: 'specialtyTranslate'},
  'department': {ref: 'departmentTranslate'},
  'events': {ref: 'eventsTranslate'},
  'eventsCategory': {ref: 'eventsCategoryTranslate'},
  'news': {ref: 'newsTranslate'},
  'page': {ref: 'pageTranslate'},
  'partners': {ref: 'partnerTranslate'},
  'specialistInfo': {ref: 'specialistInfoTranslate'},
  'format': {ref: 'formatTranslate'},
  'degree': {ref: 'degreeTranslate'},
  // 'level': {ref: 'levelTranslate'},
  'topic': {ref: 'topicTranslate'},
  'messenger': {ref: 'messengerTranslate'},
  'user': {ref: 'userTranslate'},
};


module.exports = {
  Model: Model,
  TranslateModel: TranslateModel,
}