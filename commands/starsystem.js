const axios = require('../lib/request/request')
const requestImage = require('../lib/request/request-image')
const createEmbed = require('../lib/embed/starsystem-embed')
const createDTO = require('../lib/dto/system-api-dto')

module.exports = {
  name: 'system',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Sternensystemnamen. Es können nur solche Sternensysteme angezeigt werden, welche in der Starmap verfügbar sind.',
  args: true,
  usage: '<Sternensystem>',
  cooldown: 3,
  async execute (message, args) {
    const name = args.join(' ')

    const apiData = await axios.get('starmap/starsystems/' + encodeURIComponent(name), {
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
