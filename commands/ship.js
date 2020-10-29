const requestData = require('../lib/request/request-vehicle-data')
const requestLinksData = require('../lib/request/request-vehicle-links-data')
const createVehicleLinksEmbed = require('../lib/embed/vehicle-links-embed')
const createVehicleLinkDto = require('../lib/dto/vehicle-links-api-dto')
const isNumeric = require('../lib/is-numeric')

module.exports = {
  name: 'schiff',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Fahrzeug. Es können nur solche Schiffe/Fahrzeuge angezeigt werden, welche in der ShipMatrix verfügbar sind.',
  aliases: ['s', 'ship', 'vehicle', 'v'],
  usage: '<Schiffsname / Seite>',
  cooldown: 3,
  async execute (message, args) {
    if (!args.length || (typeof args[0] === 'string' && isNumeric(args[0]))) {
      const linkData = await requestLinksData('ships', args)

      return message.channel.send(createVehicleLinksEmbed(createVehicleLinkDto(linkData), 'Raumschiffe'))
    }

    let reply
    try {
      reply = await requestData(args.join(' '), 'ships')
    } catch (e) {
      reply = await requestData(args.join(' '), 'vehicles')
    }

    message.channel.send(reply)
  },
}
