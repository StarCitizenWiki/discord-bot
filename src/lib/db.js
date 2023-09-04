const Sequelize = require('sequelize');

const { migrations } = require('../migrations/base');
const { db } = require('../../config.json');

const database = new Sequelize('database', '', '', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: db,
});

module.exports = {
  database,
  setup: () => {
    for (const definition of migrations) {
      const migration = database.define(definition.name, definition.definition);
      migration.sync();
    }
  },
};
