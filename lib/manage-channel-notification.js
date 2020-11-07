const { Permissions } = require('discord.js')
const { database } = require('./db')

/**
 * Tries to get a channel id by name
 *
 * @param {Discord.Guild} guild - The Guild
 * @param {string} name - The Channel name
 * @returns {null|string}
 */
const getChannelId = (guild, name) => {
  if (!guild.available || typeof guild.channels === 'undefined') {
    return null
  }

  const channel = guild.channels.cache.find(channel => channel.name === name)

  return channel?.id
}

/**
 * Checks if a model name exists on the db instance
 *
 * @param {string} model
 */
const checkModelExists = (model) => {
  if (typeof database.models[model] === 'undefined') {
    throw `Model '${model}' not defined.`
  }
}

/**
 * Checks if notifications are active for a given channel id
 *
 * @param {string} model - The model name
 * @param {string} channel_id - The channel id
 * @returns {Promise<boolean>}
 */
const notificationsActive = async (model, channel_id) => {
  const findResult = await database.models[model].findOne({
    where: { channel_id }
  })

  return findResult !== null
}

/**
 * Updates the notification state for a given channel
 *
 * @param {string} type - create | destroy
 * @param {string} model - The model name
 * @param {Discord.Message} message - The message
 * @param {array} args - Args
 * @returns {Promise<boolean|*>}
 */
const updateNotifications = async (type, model, message, args) => {
  let channel_id = message.channel.id
  if (typeof args[1] === 'string') {
    channel_id = getChannelId(message.guild, args[1])
  }

  if (typeof channel_id === 'undefined' || channel_id === null) {
    throw new Error('Channel not found')
  }

  switch (type) {
    case 'create':
      if (await notificationsActive(model, channel_id)) {
        return false
      }

      return database.models[model].create({
        guild_id: message.guild.id,
        channel_id,
      })

    case 'destroy':
      return database.models[model].destroy({
        where: { channel_id }
      })
  }
}

/**
 * Manage channel notifications
 * Add / remove a channel to receive given notifications
 *
 * @param {Discord.Message} message - The message
 * @param {array} args - Args
 * @param {string} model - The model name
 * @param {string} type - create | destroy
 * @returns {Promise<boolean|void>}
 */
const manageChannelNotification = async (message, args, model, type) => {
  checkModelExists(model)

  if (!message.guild || !message.guild.available) {
    message.channel.send('Kann nur Serverchannel benachrichtigen.')

    return false
  }

  if (typeof args === 'undefined' || args.length === 0) {
    return false
  }

  const user = message.guild.member(message.author)
  if (!user.hasPermission(Permissions.FLAGS.ADMINISTRATOR)) {
    message.channel.send('Nur Administratoren können Benachrichtigungen aktivieren.')

    return false
  }

  switch (args[0]) {
    case 'hinzufügen':
    case 'add':
      let activation

      try {
        activation = await updateNotifications('create', model, message, args)
      } catch (e) {
        return message.channel.send(`Channel '${args[1]}' nicht gefunden.`)
      }

      if (typeof activation === 'undefined' || !activation) {
        return message.channel.send(`Automatische ${type ?? ''} Benachrichtigungen sind bereits aktiviert.`)
      }

      return message.channel.send(`Automatische ${type ?? ''} Benachrichtigung aktiviert.`)

    case 'entfernen':
    case 'remove':
      let destroyResult

      try {
        destroyResult = await updateNotifications('destroy', model, message, args)
      } catch (e) {
        return message.channel.send(`Channel '${args[1]}' nicht gefunden.`)
      }

      if (typeof destroyResult === 'undefined' || !destroyResult) {
        return message.channel.send(`Automatische ${type ?? ''} Benachrichtigungen sind für diesen Kanal nicht aktiviert.`)
      }

      return message.channel.send(`Automatische ${type ?? ''} Benachrichtigung deaktiviert.`)

    default:
      return message.channel.send('Option war weder `add` noch `remove`.')
  }
}

module.exports = manageChannelNotification
