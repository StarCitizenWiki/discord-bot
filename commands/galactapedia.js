const requestData = require('../lib/request/galactapedia/request-galactapedia')
const createDTO = require('../lib/dto/galactapedia/galactapedia-api-dto')
const createEmbed = require('../lib/embed/galactapedia/galactapedia-embed')

module.exports = {
  name: 'galactapedia',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Galactapedia Artikel.',
  description_short: `\`$PREFIXgalactapedia [Keyword]\` - Auflistung des ersten Artikels der zum Keyword passt.`,
  aliases: ['g'],
  cooldown: 3,
  examples: [
    `Ausgabe des Artikels 'Gammon Messer': \`$PREFIXgalactapedia Gammon Messer\``,
  ],
  async execute (message, args) {
    if (!args.length) {
      return message.channel.send('Fehlendes Argument')
    }

    const name = args.map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
      .join(' ')

    const result = await requestData(name)

    if (result === null) {
      throw {
        code: 404,
        response: {
          status: 404
        }
      }
    }

    message.channel.send(createEmbed(createDTO(result[0])))
  },
}
