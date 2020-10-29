const requestData = require('../lib/request/request-vehicle-data')
const requestLinksData = require('../lib/request/request-vehicle-links-data')
const createVehicleLinksEmbed = require('../lib/embed/vehicle-links-embed')
const createVehicleLinkDto = require('../lib/dto/vehicle-links-api-dto')
const isNumeric = require('../lib/is-numeric')

module.exports = {
  name: 'fahrzeug',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Fahrzeug. Es können nur solche Fahrzeuge angezeigt werden, welche in der ShipMatrix verfügbar sind.',
  aliases: ['f', 'vehicle', 'v'],
  usage: '<Fahrzeugname / Seite>',
  cooldown: 3,
  async execute (message, args) {
    if (!args.length || (typeof args[0] === 'string' && isNumeric(args[0]))) {
      const linkData = await requestLinksData('vehicles', args)

      return message.channel.send(createVehicleLinksEmbed(createVehicleLinkDto(linkData), 'Fahrzeuge'))
    }

    let reply = await requestData(args.join(' '), 'vehicles')

    message.channel.send(reply)
  },
}
