const { SlashCommandBuilder } = require('discord.js');

const requestImage = require('../lib/request/request-image');
const createEmbed = require('../lib/embed/starsystem/starsystem-embed');
const createDTO = require('../lib/dto/starsystem/starsystem-api-dto');
const requestData = require('../lib/request/starsystem/request-starsystem');
const requestLinkData = require('../lib/request/starsystem/request-starsystem-links');
const createSystemLinksEmbed = require('../lib/embed/starsystem/starsystem-links-embed');
const createSystemLinkDto = require('../lib/dto/starsystem/starsystem-links-api-dto');
const { translate } = require('../lib/translate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('system')
    .setNameLocalizations({
      'en-US': 'system',
      fr: 'système',
    })
    .setDescription('Erzeugt eine Informationskarte zu Sternensystemen.')
    .setDescriptionLocalizations({
      'en-US': 'Generates an information card about star systems.',
      fr: 'Crée une carte d\'information sur les systèmes stellaires.',
    })
    .addStringOption((option) => option.setName('name')
      .setNameLocalizations({
        'en-US': 'name',
        fr: 'nom',
      })
      .setDescription('Name des Sternensystems, z.B. Stanton.')
      .setDescriptionLocalizations({
        'en-US': 'Name of the star system, e.g. Stanton.',
        fr: 'Nom du système stellaire, par exemple Stanton.',
      }))
    .addIntegerOption((option) => option.setName('seite')
      .setNameLocalizations({
        'en-US': 'page',
        fr: 'page',
      })
      .setDescription('Ändern der Seite, bei Ausgabe aller Sternensysteme.')
      .setDescriptionLocalizations({
        'en-US': 'Change the page, when outputting all star systems.',
        fr: 'Modifier la page, lors de la sortie de tous les systèmes stellaires.',
      })),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    if (interaction.options.getInteger('seite') || interaction.options.getString('name') === null) {
      const data = await requestLinkData(interaction);
      return interaction.editReply({ embeds: [createSystemLinksEmbed(createSystemLinkDto(data), interaction)] });
    }

    const name = interaction.options.getString('name');

    const result = await requestData(interaction);
    const image = await requestImage(`${name}|${name} (${translate(interaction, 'starsystem')})`);

    return interaction.editReply({ embeds: [createEmbed(createDTO(result.data, image), interaction)] });
  },
};
