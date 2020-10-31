const axios = require('../lib/request/request')
const requestImage = require('../lib/request/request-image')
const createEmbed = require('../lib/embed/starsystem-embed')
const createDTO = require('../lib/dto/starsystem-api-dto')
const requestLinksData = require('../lib/request/request-starsystems-links-data')
const createSystemLinksEmbed = require('../lib/embed/starsystem-links-embed')
const createSystemLinkDto = require('../lib/dto/starsystem-links-api-dto')
const isNumeric = require('../lib/is-numeric')

module.exports = {
  name: 'system',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Sternensystemnamen.\nEs können nur solche Sternensysteme angezeigt werden, welche in der Starmap verfügbar sind.',
  aliases: ['sys'],
  usage: 'Sternensystem',
  cooldown: 3,
  examples: [
    `Ausgabe des Sternensyetems Sol: \`$PREFIXsys SOL\``,
    `Ausgabe des Sternensystems Stanton: \`$PREFIXsystem Stanton\``,
  ],
  async execute (message, args) {
    if (!args.length || (typeof args[0] === 'string' && isNumeric(args[0]))) {
      const linkData = await requestLinksData(args)

      return message.channel.send(createSystemLinksEmbed(createSystemLinkDto(linkData)))
    }

    const name = args.join(' ')

    const apiData = await axios.get('starmap/starsystems/' + encodeURIComponent(name.toLowerCase()), {
      params: {
        include: 'celestial_objects,jumppoints'
      }
    })
      .catch(error => {
        return error
      })

    if (apiData.status !== 200) {
      throw apiData
    }

    const result = apiData.data
    const image = await requestImage(name)

    const reply = createEmbed(createDTO(result.data, image))

    message.channel.send(reply)
  },
}
