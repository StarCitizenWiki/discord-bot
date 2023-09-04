const { Op } = require('sequelize');

const requestData = require('../lib/request/request-comm-link-data');
const createDTO = require('../lib/dto/comm-link-api-dto');
const createEmbed = require('../lib/embed/comm-links-embed');
const log = require('../lib/console-logger');
const { database } = require('../lib/db');

const execute = async () => {
  log('Executing Comm-Link Notification Job');

  let data;

  try {
    data = createDTO(await requestData());
  } catch (e) {
    log(e, {}, 'error');

    return;
  }

  if (typeof data === 'undefined') {
    return;
  }

  let publishedIds = await database.models.cl_notified.findAll({
    limit: 50,
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  if (publishedIds.length === 0) {
    await database.models.cl_notified.bulkCreate(data.map((data) => ({
      cl_id: data.id,
    })));

    return;
  }

  publishedIds = publishedIds.map((id) => id.cl_id);

  data = data.filter((commLink) => !publishedIds.includes(commLink.id));
  const filteredIds = data.map((commLink) => commLink.id);

  if (data.length === 0) {
    return;
  }

  await database.models.cl_notified.bulkCreate(filteredIds.map((id) => ({
    cl_id: id,
  })));

  log(`Found ${filteredIds.length} new Comm-Links`, filteredIds);

  const embed = createEmbed(data);

  if (embed.fields.length === 0) {
    return;
  }

  const channelIds = await database.models.cl_notification_channel.findAll({
    attributes: ['channel_id'],
  });
  const errors = [];

  log(`Sending messages to ${channelIds.length} channels`);

  channelIds.forEach((channelData) => {
    const channel = global.client.channels.cache.get(channelData.channel_id);

    if (typeof channel === 'undefined') {
      log(`Channel ${channelData.channel_id} does not exist anymore...`);

      return errors.push(channelData.channel_id);
    }

    channel.send({ embeds: [embed] })
      .catch(() => {
        errors.push(channelData.channel_id);
      });
  });

  if (errors.length > 0) {
    await database.models.cl_notification_channel.destroy({
      where: {
        channel_id: {
          [Op.in]: errors,
        },
      },
    });
  }
};

module.exports = execute;
