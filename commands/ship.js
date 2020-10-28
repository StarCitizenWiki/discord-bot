const requestData = require('../lib/request/request-vehicle-data')

module.exports = {
  name: 'ship',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Fahrzeug. Es können nur solche Schiffe/Fahrzeuge angezeigt werden, welche in der ShipMatrix verfügbar sind.',
  aliases: ['s', 'schiff', 'vehicle', 'v'],
  args: true,
  usage: '<Schiffsname>',
  cooldown: 3,
  async execute (message, args) {
    let reply;
    try {
      reply = await requestData(args.join(' '), 'ships')
    } catch (e) {
      reply = await requestData(args.join(' '), 'vehicles')
    }

    message.channel.send(reply)
  },
}
