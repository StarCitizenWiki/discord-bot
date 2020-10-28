'use strict'

const fs = require('fs')
const Discord = require('discord.js')
const { prefix, token } = require('./config.json')
const log = require('./lib/console-logger')

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.options.presence = {
  activity: {
    type: 'PLAYING',
    name: 'sc_help',
  }
}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

const cooldowns = new Discord.Collection()

client.once('ready', () => {
  log('Ready!')
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
    let reply = `Du hast keine Argumente angegeben, ${message.author}!`

    if (command.usage) {
      reply += `\nDie richtige Verwendung wäre: \`${prefix}${command.name} ${command.usage}\``
    }

    return message.channel.send(reply)
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

      console.log(error)
      message.reply('Der Befehl konnte nicht ausgeführt werden.')
    })
})

// Log our bot in using the token from https://discord.com/developers/applications
client.login(token)
