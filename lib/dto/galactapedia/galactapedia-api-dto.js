const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => ({
  title: safeValueAccess('title', data),
  image: safeValueAccess('thumbnail', data, null),
  url: safeValueAccess('url', data),
  translation: safeValueAccess('english.data.translation', data, ''),

  properties: safeValueAccess('properties.data', data, [], true),
  categories: safeValueAccess('categories.data', data, [], true).map((category) => category.name),
  relatedArticles: safeValueAccess('related_articles.data', data, [], true).map((related) => ({
    title: related.title,
    url: related.url,
  })),
});

module.exports = createDTO;
