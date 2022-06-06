const { SlashCommandBuilder } = require('@discordjs/builders');

const requestData = require('../lib/request/vehicle/request-vehicle');
const requestLinkData = require('../lib/request/vehicle/request-vehicle-links');
const createVehicleLinksEmbed = require('../lib/embed/vehicle/vehicle-links-embed');
const createVehicleLinkDto = require('../lib/dto/vehicle/vehicle-links-api-dto');
const createVehicleEmbed = require('../lib/embed/vehicle/vehicle-embed');
const createVehicleDto = require('../lib/dto/vehicle/vehicle-api-dto');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('schiff')
    .setDescription('Erzeugt eine Informationskarte zu einem bestimmten Raumschiff oder Fahrzeug.')
    .addStringOption((option) => option.setName('name').setDescription('Name des Raumschiffs.'))
    .addIntegerOption((option) => option.setName('seite').setDescription('Ändern der Seite, bei Ausgabe aller Raumschiffe.')),
  /**
     * @param {CommandInteraction} interaction
     * @returns {Promise<boolean|void>}
     */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    if (interaction.options.getInteger('seite') || interaction.options.getString('name') === null) {
      const data = await requestLinkData('ships', interaction.options.getInteger('seite'));
      return interaction.editReply({ embeds: [createVehicleLinksEmbed(createVehicleLinkDto(data), 'Raumschiffe')] });
    }

    const name = interaction.options.getString('name');
    const reply = await requestData(name, 'ships');

    return interaction.editReply({ embeds: [createVehicleEmbed(createVehicleDto(reply))] });
  },
};
