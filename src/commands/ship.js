const { SlashCommandBuilder } = require('discord.js');

const requestData = require('../lib/request/vehicle/request-vehicle');
const createVehicleEmbed = require('../lib/embed/vehicle/vehicle-embed');
const createVehicleDto = require('../lib/dto/vehicle/vehicle-api-dto');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setNameLocalizations({
      de: 'schiff',
      fr: 'vaisseau',
    })
    .setDescription('Generates an information card about a specific spacecraft or vehicle.')
    .setDescriptionLocalizations({
      de: 'Erzeugt eine Informationskarte zu einem bestimmten Raumschiff oder Fahrzeug.',
      fr: 'Crée une carte d\'information sur un vaisseau spatial ou un véhicule spécifique.',
    })
    .addStringOption((option) => option
      .setName('name')
      .setNameLocalizations({
        fr: 'nom',
      })
      .setDescription('Vehicle name')
      .setDescriptionLocalizations({
        de: 'Fahrzeug name',
        fr: 'Nom du véhicule',
      })
      .setAutocomplete(true)
      .setRequired(true)),
  /**
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<boolean|void>}
     */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const reply = await requestData(interaction);

    return interaction.editReply({ embeds: [createVehicleEmbed(createVehicleDto(reply), interaction)] });
  },
};
