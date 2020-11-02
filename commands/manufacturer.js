const requestData = require('../lib/request/manufacturer/request-manufacturer')
const requestImage = require('../lib/request/request-image')
const createEmbed = require('../lib/embed/manufacturer/manufacturer-embed')
const createLinkEmbed = require('../lib/embed/manufacturer/manufacturer-links-embed')
const createDTO = require('../lib/dto/manufacturer/manufacturer-api-dto')
const createLinkDTO = require('../lib/dto/manufacturer/manufacturer-links-api-dto')

module.exports = {
  name: 'hersteller',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Hersteller.',
  description_short: `\`$PREFIXhersteller\` - Auflistung aller Hersteller\n\`$PREFIXhersteller [Name]\` - Informationen zu einzelnem Hersteller`,
  aliases: ['h', 'm', 'manufacturer', 'manufacturers'],
  usage: 'Herstellername',
  cooldown: 3,
  examples: [
    `Ausgabe aller Hersteller: \`$PREFIXhersteller\``,
    `Ausgabe des Herstellers RSI: \`$PREFIXhersteller RSI\``,
    `Ausgabe des Herstellers Anvil Aerospace: \`$PREFIXh ANVL\``,
  ],
  async execute (message, args) {
    let data

    if (!args.length) {
      data = await requestData('')

      return message.channel.send(createLinkEmbed(createLinkDTO(data.data)))
    }

    const name = args.join(' ')

    const result = await requestData(name)
    const image = await requestImage(name)

    const reply = createEmbed(createDTO(result.data, image))

    message.channel.send(reply)
  },
}
