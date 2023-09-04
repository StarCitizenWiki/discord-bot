const { SlashCommandBuilder } = require('discord.js');

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
      title: 'Star Citizen Statistiken',
      footer,
    });

    reply.addFields([
      { name: 'Spenden', value: formatFunds(result.funds), inline: true },
      { name: 'Fleet', value: result.fleet.toLocaleString('de-DE'), inline: true },
    ]);

    await interaction.editReply({ embeds: [reply] });
  },
};
