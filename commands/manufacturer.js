const axios = require('../lib/request/request')
const requestImage = require('../lib/request/request-image')
const createEmbed = require('../lib/embed/manufacturer-embed')
const createDTO = require('../lib/dto/manufacturer-api-dto')

module.exports = {
  name: 'manufacturer',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Hersteller.',
  aliases: ['m', 'hersteller'],
  args: true,
  usage: '<Herstellername>',
  cooldown: 3,
  async execute (message, args) {
    const name = args.join(' ')

    const apiData = await axios.get('manufacturers/' + encodeURIComponent(name.toLowerCase()), {
      params: {
        include: 'ships,vehicles'
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
