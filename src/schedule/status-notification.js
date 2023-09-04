const { Op } = require('sequelize');

const createStatusEmbed = require('../lib/embed/status/status-services-embed');
const createIncidentEmbed = require('../lib/embed/status/status-incident-embed');
const log = require('../lib/console-logger');
const { database } = require('../lib/db');

const execute = async () => {
  log('Executing Status Notification Job');

  const statusData = await database.models.rsi_system_status.findOne({
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  const incidentData = await database.models.rsi_system_incidents.findOne({
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  if (statusData === null || incidentData === null) {
    return;
  }

  let publishedIds = await database.models.rsi_system_incidents_published.findAll({
    limit: 10,
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  publishedIds = publishedIds.map((id) => id.incident_id);

  if (publishedIds.includes(incidentData.incident_id)) {
    return;
  }

  await database.models.rsi_system_incidents_published.create({
    incident_id: incidentData.incident_id,
  });

  const channelIds = await database.models.incident_notification_channel.findAll({
    attributes: ['channel_id'],
  });

  if (channelIds.length === 0) {
    return;
  }

  const errors = [];

  log(`Sending messages to ${channelIds.length} channels`);

  const statusEmbed = createStatusEmbed(statusData);
  const incidentEmbed = createIncidentEmbed(incidentData);

  channelIds.forEach((channelData) => {
    const channel = global.client.channels.cache.get(channelData.channel_id);

    if (typeof channel === 'undefined') {
      log(`Channel ${channelData.channel_id} does not exist anymore...`);

      return errors.push(channelData.channel_id);
    }

    channel.send({ embeds: [statusEmbed] })
      .catch(() => {
        errors.push(channelData.channel_id);
      });

    channel.send({ embeds: [incidentEmbed] })
      .catch(() => {
        errors.push(channelData.channel_id);
      });
  });

  if (errors.length > 0) {
    await database.models.incident_notification_channel.destroy({
      where: {
        channel_id: {
          [Op.in]: errors,
        },
      },
    });
  }
};

module.exports = execute;
