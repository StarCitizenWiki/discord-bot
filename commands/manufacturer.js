const axios = require('../lib/request/request')
const requestImage = require('../lib/request/request-image')
const createEmbed = require('../lib/embed/manufacturer-embed')
const createLinkEmbed = require('../lib/embed/manufacturer-links-embed')
const createDTO = require('../lib/dto/manufacturer-api-dto')
const createLinkDTO = require('../lib/dto/manufacturer-links-api-dto')

const loadData = async (uri, params = {}) => {
  const data = await axios.get(`manufacturers${uri}`, {
    params
  })
    .catch(error => {
      return error
    })

  if (data.status !== 200) {
    throw data
  }

  return data
}

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
      data = await loadData('')

      return message.channel.send(createLinkEmbed(createLinkDTO(data.data.data)))
    }

    const name = args.join(' ')

    data = await loadData(`/${encodeURIComponent(name.toLowerCase())}`, {
      include: 'ships,vehicles'
    })

    const result = data.data
    const image = await requestImage(name)

    const reply = createEmbed(createDTO(result.data, image))

    message.channel.send(reply)
  },
}
