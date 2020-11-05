'use strict'

const fs = require('fs')
const Discord = require('discord.js')

const log = require('./lib/console-logger')
const commLinkSchedule = require('./schedule/comm-link-notification')
const createdEmbed = require('./lib/embed/help-embed')
const { database, setup: setupDb } = require('./lib/db')
const { local, prefix, token, comm_link_interval } = require('./config.json')
const client = new Discord.Client()

client.commands = new Discord.Collection()

if (typeof local === 'undefined' || !local) {
  client.options.presence = {
    activity: {
      type: 'PLAYING',
      name: `${prefix}hilfe`,
    }
  }
}

setupDb()
global.client = client

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

const cooldowns = new Discord.Collection()

client.once('ready', () => {
  log('Ready!')

  setInterval(() => {
    commLinkSchedule().catch((e) => {
      console.error(e)
      log('Error in Comm Link schedule.')
    })
  }, comm_link_interval)
})

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) {
    return
  }

  if (command.args && !args.length) {
    message.channel.send('Dieser Befehl wurde falsch verwendet, hier ist die Hilfeseite:')
    return message.channel.send(createdEmbed(command))
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000

      log(`User ${message.author.username} trying to use command on cooldown`, {
        user: message.author.username,
        command: command.name
      }, 'debug')

      return message.reply(`Bitte warte noch ${timeLeft.toFixed(1)} Sekunden bis du den Befehl \`${command.name}\` erneut benutzt.`)
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  log(`Executing command '${command.name}' with args ${JSON.stringify(args)}`)

  command.execute(message, args)
    .catch(error => {
      if (error.code === 'ENOTFOUND') {
        log('Could not connect to API', error, 'error')

        return message.channel.send('Die Star Citizen Wiki API ist unter der angegebenen URL nicht erreichbar.')
      }

      if (typeof error.response !== 'undefined' && typeof error.response.status !== 'undefined') {
        if (error.response.status === 504 || error.response.status === 500) {
          log('Could not connect to API', error, 'error')

          return message.channel.send('Die Star Citizen Wiki API ist derzeit nicht erreichbar')
        }

        if (error.response.status === 404) {
          log('Call resulted in 404', {
            command: command.name,
            args: args.join(' ')
          }, 'debug')

          return message.channel.send(`Keine Daten zu "${args.join(' ')}" gefunden.`)
        }

        if (error.response.status === 429) {
          log('API calls are rate-limited', {}, 'warn')

          return message.channel.send('Zu viele Anfragen gesendet. Bitte warten.')
        }
      }

      console.error(error)
      message.reply('Der Befehl konnte nicht ausgeführt werden.')
    })
})

client.on('guildCreate', guild => {
  if (guild.available) {
    return log(`Bot added to server "${guild.name}".`)
  }

  log(`Bot added to server.`)
})

client.on('guildDelete', guild => {
  if (guild.available) {
    log(`Bot removed from server "${guild.name}".`)

    database.models.cl_notification_channel.destroy({
      where: { guild_id: guild.id }
    })

    return
  }

  log(`Bot removed from server.`)

})

client.login(token)
