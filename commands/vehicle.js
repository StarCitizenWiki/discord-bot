const requestData = require('../lib/request/request-vehicle-data')
const requestLinksData = require('../lib/request/request-vehicle-links-data')
const createVehicleLinksEmbed = require('../lib/embed/vehicle-links-embed')
const createVehicleLinkDto = require('../lib/dto/vehicle-links-api-dto')
const isNumeric = require('../lib/is-numeric')

module.exports = {
  name: 'fahrzeug',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Fahrzeug.\nEs können nur solche Fahrzeuge angezeigt werden, welche in der ShipMatrix verfügbar sind.',
  description_extended: `\`$PREFIXfahrzeug\` - Auflistung aller Fahrzeuge\n\`$PREFIXfahrzeug [Nr.]\` - Ändern der angezeigten Seite\n\`$PREFIXfahrzeug [Name]\` - Informationen zu einzelnem Fahrzeug`,
  aliases: ['f', 'vehicle', 'v', 'vehicles', 'fahrzeuge'],
  usage: 'Fahrzeugname / Seite',
  cooldown: 3,
  examples: [
    `Ausgabe des Fahrzeugs Ursa Rover: \`$PREFIXschiff Ursa Rover\``,
    `Ausgabe aller Fahrzeuge: \`$PREFIXfahrzeug\``,
    `Ausgabe aller Fahrzeuge auf Seite 2: \`$PREFIXf 2\``,
  ],
  async execute (message, args) {
    if (!args.length || (typeof args[0] === 'string' && isNumeric(args[0]) && args.length === 1)) {
      const linkData = await requestLinksData('vehicles', args)

      return message.channel.send(createVehicleLinksEmbed(createVehicleLinkDto(linkData), 'Fahrzeuge'))
    }

    let reply = await requestData(args.join(' '), 'vehicles')

    message.channel.send(reply)
  },
}
