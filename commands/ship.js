const requestData = require('../lib/request/vehicle/request-vehicle')
const requestLinksData = require('../lib/request/vehicle/request-vehicle-links')
const createVehicleLinksEmbed = require('../lib/embed/vehicle/vehicle-links-embed')
const createVehicleLinkDto = require('../lib/dto/vehicle/vehicle-links-api-dto')
const createVehicleEmbed = require('../lib/embed/vehicle/vehicle-embed')
const createVehicleDto = require('../lib/dto/vehicle/vehicle-api-dto')
const isNumeric = require('../lib/is-numeric')

module.exports = {
  name: 'schiff',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Raumschiff oder Fahrzeug.\nEs können nur solche Schiffe/Fahrzeuge angezeigt werden, welche in der ShipMatrix verfügbar sind.',
  description_short: `\`$PREFIXschiff\` - Auflistung aller Raumschiffe\n\`$PREFIXschiff [Nr.]\` - Ändern der angezeigten Seite\n\`$PREFIXschiff [Name]\` - Informationen zu einzelnem Raumschiff`,
  aliases: ['s', 'ship', 'vehicle', 'v', 'ships', 'schiffe', 'vehicles'],
  usage: 'Schiffsname / Seite',
  cooldown: 3,
  examples: [
    `Ausgabe des Raumschiffs Carrack: \`$PREFIXschiff Carrack\``,
    `Ausgabe aller Raumschiffe: \`$PREFIXschiff\``,
    `Ausgabe aller Raumschiffe auf Seite 2: \`$PREFIXschiff 2\``,
  ],
  async execute (message, args) {
    if (!args.length || (typeof args[0] === 'string' && isNumeric(args[0]) && args.length === 1)) {
      const linkData = await requestLinksData('ships', args)

      return message.channel.send(createVehicleLinksEmbed(createVehicleLinkDto(linkData), 'Raumschiffe'))
    }

    let reply
    try {
      reply = await requestData(args.join(' '), 'ships')
    } catch (e) {
      console.error(e)
      reply = await requestData(args.join(' '), 'vehicles')
    }

    message.channel.send(createVehicleEmbed(createVehicleDto(reply)))
  },
}
