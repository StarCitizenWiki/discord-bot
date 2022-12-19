'use strict'

const fs = require('node:fs')
const path = require('node:path')
const Discord = require('discord.js')

const log = require('./lib/console-logger')
const commLinkSchedule = require('./schedule/comm-link-notification')
const statusSchedule = require('./schedule/update-status')
const statusNotificationSchedule = require('./schedule/status-notification')
const { database, setup: setupDb } = require('./lib/db')
const { local, token, comm_link_interval, status_interval } = require('./config.json')
const {Intents} = require("discord.js");
const requestData = require("./lib/request/item/request-search-item");
const client = new Discord.Client({
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.DIRECT_MESSAGES,
  ]
})

const commandsPath = path.join(__dirname, 'commands')
client.commands = new Discord.Collection()

setupDb()
global.client = client

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command)
}

let comm_link_interval_id = null
let status_interval_id = null

client.once('ready', () => {
  log('Ready!')

  clearInterval(comm_link_interval_id)
  clearInterval(status_interval_id)

  comm_link_interval_id = setInterval(() => {
    commLinkSchedule().catch((e) => {
      console.error(e)
      log('Error in Comm Link schedule.')
    })
  }, comm_link_interval ?? 600000)

  status_interval_id = setInterval(() => {
    statusSchedule()
      .then(() => {
        statusNotificationSchedule()
          .catch((e) => {
            console.error(e)
            log('Error in Status Notification schedule.')
          })
      })
      .catch((e) => {
        console.error(e)
        log('Error in Status schedule.')
      })
  }, status_interval ?? 600000)

  if (typeof local === 'undefined' || !local) {
    client.user.setActivity('Update: /commands')
  }
})


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  command.execute(interaction)
      .catch(error => {
    if (error.code === 'ENOTFOUND') {
      log('Could not connect to API', error.message, 'error')

      return interaction.editReply({content: 'Die Star Citizen Wiki API ist unter der angegebenen URL nicht erreichbar.'})
    }

    if (typeof error.response !== 'undefined' && typeof error.response.status !== 'undefined') {
      if (error.response.status === 504 || error.response.status === 500) {
        log('Could not connect to API', error, 'error')

        return interaction.editReply({ content: 'Die Star Citizen Wiki API ist derzeit nicht erreichbar'})
      }

      if (error.response.status === 404) {
        log('Call resulted in 404', {
          command: command.data.name,
          args: interaction.options.getString('name') ?? interaction.options.getString('suche')
        }, 'debug')

        if (error.response?.statusText !== 'Not Found') {
          console.error(error)
        }

        return interaction.editReply({content: `Ich konnte keine Daten zu der Eingabe finden.`})
      }

      if (error.response.status === 429) {
        log('API calls are rate-limited', {}, 'warn')

        return interaction.editReply({ content: 'Zu viele Anfragen gesendet. Bitte warten.'})
      }
    }

    console.error(error)
    interaction.reply({content: 'Der Befehl konnte nicht ausgeführt werden.'})
        .catch(() => {
          log('Could not send message')
        })
  })
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isAutocomplete()) return;

  const focusedValue = interaction.options.getFocused();
  let requestData;
  let data = [];
  let key = 'name';
  let valueKey = null;

  switch (interaction.commandName) {
    case 'item':
      requestData = require('./lib/request/item/request-search-item');
      break;

    case 'fahrzeug':
    case 'schiff':
      requestData = require('./lib/request/vehicle/request-search-vehicle');
      break;

    case 'galactapedia':
      key = 'title';
      valueKey = 'id';
      requestData = require('./lib/request/galactapedia/request-search-galactapedia');
      break;

    default:
      return;
  }

  if (focusedValue.length > 0) {
    data = (await requestData(focusedValue)).result;
  }

  await interaction.respond(
      data.map(res => {
        return {
          name: res[key],
          value: res[valueKey ?? key],
        }
      })
  );
});

client.on('guildCreate', guild => {
  if (guild.available) {
    return log(`Bot added to server "${guild.name}"`)
  }

  log(`Bot added to server`)
})

client.on('guildDelete', guild => {
  if (guild.available) {
    log(`Bot removed from server "${guild.name}"`);

    ['cl_notification_channel', 'incident_notification_channel'].forEach(model => {
      database.models[model].destroy({
        where: { guild_id: guild.id }
      })
    })

    return
  }

  log(`Bot removed from server`)
})

client.login(token)
