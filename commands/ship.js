const requestData = require('../lib/request/request-vehicle-data')

module.exports = {
  name: 'ship',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Schiffsnamen. Es können nur solche Schiffe angezeigt werden, welche in der ShipMatrix verfügbar sind.',
  aliases: ['s', 'schiff'],
  args: true,
  usage: '<Schiffsname>',
  cooldown: 3,
  async execute (message, args) {
    const reply = await requestData(args.join(' '), 'ships')

    message.channel.send(reply)
  },
}
