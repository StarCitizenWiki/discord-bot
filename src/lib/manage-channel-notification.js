const { PermissionFlags, ChatInputCommandInteraction } = require('discord.js');
const { database } = require('./db');

/**
 * Checks if a model name exists on the db instance
 *
 * @param {string} model
 */
const checkModelExists = (model) => {
  if (typeof database.models[model] === 'undefined') {
    throw `Model '${model}' not defined.`;
  }
};

/**
 * Checks if notifications are active for a given channel id
 *
 * @param {string} model - The model name
 * @param {string} channel_id - The channel id
 * @returns {Promise<boolean>}
 */
const notificationsActive = async (model, channel_id) => {
  const findResult = await database.models[model].findOne({
    where: { channel_id },
  });

  return findResult !== null;
};

/**
 * Updates the notification state for a given channel
 *
 * @param {string} type - create | destroy
 * @param {string} model - The model name
 * @param {ChatInputCommandInteraction} interaction - The interaction
 * @returns {Promise<boolean|*>}
 */
const updateNotifications = async (type, model, interaction) => {
  const channel_id = interaction.channelId;

  if (typeof channel_id === 'undefined' || channel_id === null) {
    throw new Error('Channel not found');
  }

  switch (type) {
    case 'create':
      if (await notificationsActive(model, channel_id)) {
        return false;
      }

      return database.models[model].create({
        guild_id: interaction.guildId,
        channel_id,
      });

    case 'destroy':
      return database.models[model].destroy({
        where: { channel_id },
      });
  }
};

/**
 * Manage channel notifications
 * Add / remove a channel to receive given notifications
 *
 * @param {ChatInputCommandInteraction} interaction - The interaction
 * @param {string} model - The model name
 * @param {string} type - create | destroy
 * @returns {Promise<boolean|void>}
 */
const manageChannelNotification = async (interaction, model, type) => {
  checkModelExists(model);

  if (!interaction.guild || !interaction.guild.available) {
    await interaction.editReply({ content: 'Kann nur Serverchannel benachrichtigen.' });

    return false;
  }

  if (!interaction.member.permissions.has(PermissionFlags.Administrator)) {
    await interaction.editReply({ content: 'Nur Administratoren können Benachrichtigungen aktivieren.' });

    return false;
  }

  if (interaction.options.getBoolean('add') === true) {
    let activation;

    try {
      activation = await updateNotifications('create', model, interaction);
    } catch (e) {
      return interaction.editReply({ content: 'Channel nicht gefunden.' });
    }

    if (typeof activation === 'undefined' || !activation) {
      return interaction.editReply({ content: `Automatische ${type ?? ''} Benachrichtigungen sind bereits aktiviert.` });
    }

    return interaction.editReply({ content: `Automatische ${type ?? ''} Benachrichtigung aktiviert.` });
  } if (interaction.options.getBoolean('remove') === true) {
    let destroyResult;

    try {
      destroyResult = await updateNotifications('destroy', model, interaction);
    } catch (e) {
      return interaction.channel.send('Channel nicht gefunden.');
    }

    if (typeof destroyResult === 'undefined' || !destroyResult) {
      return interaction.editReply({ content: `Automatische ${type ?? ''} Benachrichtigungen sind für diesen Kanal nicht aktiviert.` });
    }

    return interaction.editReply({ content: `Automatische ${type ?? ''} Benachrichtigung deaktiviert.` });
  }
};

module.exports = manageChannelNotification;
