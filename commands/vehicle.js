const requestData = require('../lib/request/request-vehicle-data')

module.exports = {
  name: 'vehicle',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Fahrzeugnamen. Es können nur solche Fahrzeuge angezeigt werden, welche in der ShipMatrix verfügbar sind.',
  aliases: ['v', 'fahrzeug'],
  args: true,
  usage: '<Fahrzeugname>',
  cooldown: 3,
  async execute (message, args) {
    const reply = await requestData(args.join(' '), 'vehicles')

    message.channel.send(reply)
  },
}
