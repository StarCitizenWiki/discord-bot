const { SlashCommandBuilder } = require('@discordjs/builders');

const Discord = require('discord.js');
const axios = require('../lib/request/request');
const { footer } = require('../config.json');

const formatFunds = (funds) => {
  const intVal = parseInt(funds.substring(0, funds.length - 3), 10);

  return `${intVal.toLocaleString('de-DE')}$`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Erzeugt eine Informationskarte zu den aktuellen Spendenstatistiken und der Anzahl Citizens.'),
  /**
   * @param {CommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const apiData = await axios.get('stats/latest')
      .catch((error) => error);

    if (apiData.status !== 200) {
      throw apiData;
    }

    const result = apiData.data.data;

    const reply = new Discord.MessageEmbed({
      timestamp: result.timestamp,
      title: 'Star Citizen Statistiken',
      footer,
    });

    reply
      .addField('Spenden', formatFunds(result.funds), true)
      .addField('Fleet', result.fleet.toLocaleString('de-DE'), true);

    await interaction.editReply({ embeds: [reply] });
  },
};
