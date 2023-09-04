const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => ({
  title: safeValueAccess('title', data),
  image: safeValueAccess('thumbnail', data, null),
  url: safeValueAccess('rsi_url', data),
  translation: safeValueAccess('translations', data, ''),

  properties: safeValueAccess('properties', data, [], true),
  categories: safeValueAccess('categories', data, [], true).map((category) => category.name),
  relatedArticles: safeValueAccess('related_articles', data, []).map((related) => ({
    title: related.title,
    url: related.url,
  })),
});

module.exports = createDTO;
