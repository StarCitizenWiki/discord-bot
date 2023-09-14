const { Events } = require('discord.js');
const log = require('../lib/console-logger');
const commLinkSchedule = require('../schedule/comm-link-notification');
const statusSchedule = require('../schedule/update-status');
const statusNotificationSchedule = require('../schedule/status-notification');
const {
  local, comm_link_interval, status_interval,
} = require('../../config.json');

let comm_link_interval_id = null;
let status_interval_id = null;

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    log('Ready!');

    clearInterval(comm_link_interval_id);
    clearInterval(status_interval_id);

    comm_link_interval_id = setInterval(() => {
      commLinkSchedule().catch((e) => {
        console.error(e);
        log('Error in Comm Link schedule.');
      });
    }, comm_link_interval ?? 600000);

    status_interval_id = setInterval(() => {
      statusSchedule()
        .then(() => {
          statusNotificationSchedule()
            .catch((e) => {
              console.error(e);
              log('Error in Status Notification schedule.');
            });
        })
        .catch((e) => {
          console.error(e);
          log('Error in Status schedule.');
        });
    }, status_interval ?? 600000);

    if (typeof local === 'undefined' || !local) {
      client.user.setActivity('Update: /commands');
    }
  },
};
