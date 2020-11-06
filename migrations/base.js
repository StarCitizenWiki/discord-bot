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
    },
    {
      name: 'rsi_system_status',
      definition: {
        platform: Sequelize.STRING,
        pu: Sequelize.STRING,
        ea: Sequelize.STRING,
      }
    },
    {
      name: 'rsi_system_incidents',
      definition: {
        incident_id: {
          type: Sequelize.STRING,
          unique: true,
          primaryKey: true
        },
        title: Sequelize.STRING,
        incident_date: Sequelize.DATE,
        updated_date: Sequelize.DATE,
        severity: Sequelize.STRING,
        affected_systems: Sequelize.STRING,
        resolved: Sequelize.BOOLEAN,
        content: Sequelize.TEXT
      }
    },
    {
      name: 'rsi_system_incidents_published',
      definition: {
        incident_id: {
          type: Sequelize.STRING,
          unique: true,
        },
      }
    },
    {
      name: 'incident_notification_channel',
      definition: {
        guild_id: Sequelize.STRING,
        channel_id: {
          type: Sequelize.STRING,
          unique: true,
        },
      }
    },
  ]
}
