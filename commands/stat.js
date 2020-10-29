const axios = require('../lib/request/request')
const Discord = require('discord.js')
const { footer } = require('../config.json')

const formatFunds = (funds) => {
  const intVal = parseInt(funds.substr(0, funds.length - 3))

  return `${intVal.toLocaleString('de-DE')}$`
}

module.exports = {
  name: 'stats',
  aliases: ['statistik', 'statistiken'],
  description: 'Erzeugt eine Informationskarte zu den aktuellen Spendenstatistiken und der Anzahl Citizens.',
  cooldown: 3,
  async execute (message) {

    const apiData = await axios.get('stats/latest')
      .catch(error => {
        return error
      })

    if (apiData.status !== 200) {
      throw apiData
    }

    const result = apiData.data.data

    const reply = new Discord.MessageEmbed({
      timestamp: result.timestamp,
      title: 'Star Citizen Statistiken',
      footer
    })

    reply
      .addField('Spenden', formatFunds(result.funds), true)
      .addField('Fleet', result.fleet.toLocaleString('de-DE'), true)

    message.channel.send(reply)
  },
}
