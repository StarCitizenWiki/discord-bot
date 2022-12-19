const { SlashCommandBuilder } = require('@discordjs/builders');

const requestData = require('../lib/request/vehicle/request-vehicle');
const createVehicleEmbed = require('../lib/embed/vehicle/vehicle-embed');
const createVehicleDto = require('../lib/dto/vehicle/vehicle-api-dto');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('schiff')
    .setDescription('Erzeugt eine Informationskarte zu einem bestimmten Raumschiff oder Fahrzeug.')
    .addStringOption((option) => option
        .setName('name')
        .setDescription('Name des Raumschiffs.')
        .setAutocomplete(true)
        .setRequired(true)
    ),
  /**
     * @param {CommandInteraction} interaction
     * @returns {Promise<boolean|void>}
     */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const name = interaction.options.getString('name');
    const reply = await requestData(name, 'ships');

    return interaction.editReply({ embeds: [createVehicleEmbed(createVehicleDto(reply))] });
  },
};
