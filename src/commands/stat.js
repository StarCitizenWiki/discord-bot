const { SlashCommandBuilder } = require('discord.js');

const Discord = require('discord.js');
const axios = require('../lib/request/request');
const { footer } = require('../../config.json');
const { translate, getLocale } = require('../lib/translate');

const formatFunds = (funds, interaction) => {
  const intVal = parseInt(funds.substring(0, funds.length - 3), 10);

  return `${intVal.toLocaleString(getLocale(interaction))}$`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setNameLocalizations({
      'en-US': 'stats',
      fr: 'statistiques',
    })
    .setDescription('Erzeugt eine Informationskarte zu den aktuellen Spendenstatistiken und der Anzahl Citizens.')
    .setDescriptionLocalizations({
      'en-US': 'Generates an information card on the current donation statistics and the number of Citizens.',
      fr: 'Crée une carte d\'information sur les statistiques actuelles des dons et le nombre de Citoyens.',
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const apiData = await axios.get('v2/stats/latest')
      .catch((error) => error);

    if (apiData.status !== 200) {
      throw apiData;
    }

    const result = apiData.data.data;

    const reply = new Discord.EmbedBuilder({
      timestamp: result.timestamp,
      title: translate(interaction, 'stats'),
      footer,
    });

    reply.addFields([
      { name: translate(interaction, 'funds'), value: formatFunds(result.funds, interaction), inline: true },
      { name: translate(interaction, 'fleet'), value: result.fleet.toLocaleString(getLocale(interaction)), inline: true },
    ]);

    await interaction.editReply({ embeds: [reply] });
  },
};
