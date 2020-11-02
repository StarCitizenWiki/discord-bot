const requestData = require('../lib/request/person/request-person-links')
const requestImage = require('../lib/request/request-image')
const createLinkEmbed = require('../lib/embed/person/person-links-embed')
const createLinkDTO = require('../lib/dto/person/person-links-api-dto')
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
      data = await requestData(args)
      return message.channel.send(createLinkEmbed(createLinkDTO(data)))
    }

    /*    if (!args.length) {
          data = await requestData('')

          return message.channel.send(createLinkEmbed(createLinkDTO(data)))
        }

        const name = args.join(' ')

        const result = await requestData(name)
        const image = await requestImage(name)

        console.log(result)

        const reply = createEmbed(createDTO(result, image))

        message.channel.send(reply)*/
  },
}
