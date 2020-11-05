const Sequelize = require('sequelize')

module.exports = {
  migrations: [
    {
      name: 'cl_notification_channel',
      definition: {
        guild_id: Sequelize.STRING,
        channel_id: {
          type: Sequelize.STRING,
          unique: true,
        },
      }
    },
    {
      name: 'cl_notified',
      definition: {
        cl_id: {
          type: Sequelize.INTEGER,
          unique: true,
        },
      }
    }
  ]
}
