const { SlashCommandBuilder } = require('@discordjs/builders');

const requestImage = require('../lib/request/request-image');
const createEmbed = require('../lib/embed/starsystem/starsystem-embed');
const createDTO = require('../lib/dto/starsystem/starsystem-api-dto');
const requestData = require('../lib/request/starsystem/request-starsystem');
const requestLinkData = require('../lib/request/starsystem/request-starsystem-links');
const createSystemLinksEmbed = require('../lib/embed/starsystem/starsystem-links-embed');
const createSystemLinkDto = require('../lib/dto/starsystem/starsystem-links-api-dto');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('system')
    .setDescription('Erzeugt eine Informationskarte zu Sternensystemen.')
    .addStringOption((option) => option.setName('name').setDescription('Name des Sternensystems, z.B. Stanton.'))
    .addIntegerOption((option) => option.setName('seite').setDescription('Ändern der Seite, bei Ausgabe aller Sternensysteme.')),
  /**
   * @param {CommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    if (interaction.options.getInteger('seite') || interaction.options.getString('name') === null) {
      const data = await requestLinkData(interaction.options.getInteger('seite'));
      return interaction.editReply({ embeds: [createSystemLinksEmbed(createSystemLinkDto(data))] });
    }

    const name = interaction.options.getString('name');

    const result = await requestData(name);
    const image = await requestImage(`${name}|${name} (Sternensystem)`);

    return interaction.editReply({ embeds: [createEmbed(createDTO(result.data, image))] });
  },
};
