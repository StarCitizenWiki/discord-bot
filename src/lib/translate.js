const { Locale } = require('discord.js');

const translations = {
  de: require('../../i18n/de.json'),
  en: require('../../i18n/en.json'),
  fr: require('../../i18n/fr.json'),
};

const config = require('../../config.json');

/**
 * @param {ChatInputCommandInteraction} interaction
 * @return string
 */
const getLocale = (interaction) => {
  if (typeof interaction !== 'object') {
    interaction = { locale: config.locale.slice(0, 2) };
  }

  let { locale } = interaction;

  if (locale === Locale.EnglishUS || locale === Locale.EnglishGB) {
    locale = 'en';
  }

  /**
   * Use locale from config
   */
  if (typeof translations[locale] === 'undefined') {
    locale = config.locale.slice(0, 2);
  }

  return locale;
};

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {string} key
 * @return string
 */
const translate = (interaction, key) => {
  const locale = getLocale(interaction);

  if (typeof translations[locale] === 'undefined' || typeof translations[locale][key] === 'undefined') {
    return key;
  }

  return translations[locale][key];
};

module.exports = {
  translate,
  getLocale,
};
