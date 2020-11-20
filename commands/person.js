const requestData = require('../lib/request/person/request-person-semantic-data')
const requestLinkData = require('../lib/request/person/request-person-links')
const requestImage = require('../lib/request/request-image')
const createLinkEmbed = require('../lib/embed/person/person-links-embed')
const createLinkDTO = require('../lib/dto/person/person-links-api-dto')
const createDTO = require('../lib/dto/person/person-api-dto')
const createEmbed = require('../lib/embed/person/person-embed')
const isNumeric = require('../lib/is-numeric')

module.exports = {
  name: 'person',
  description: 'Erzeugt eine Informationskarte zu einer bestimmten Person.',
  description_short: `\`$PREFIXperson\` - Auflistung aller im Wiki vorhandenen Persönlichkeiten`,
  aliases: ['p'],
  //usage: 'Person',
  cooldown: 3,
  examples: [],
  async execute (message, args) {
    let data
    if (!args.length || (typeof args[0] === 'string' && isNumeric(args[0]) && args.length === 1)) {
      data = await requestLinkData(args)
      return message.channel.send(createLinkEmbed(createLinkDTO(data)))
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

    const image = await requestImage(name)

    const dto = createDTO(Object.entries(result)[0][1])

    const reply = createEmbed(dto, image)

    message.channel.send(reply)
  },
}
