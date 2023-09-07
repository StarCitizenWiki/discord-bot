const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isAutocomplete()) return;

    const focusedValue = interaction.options.getFocused();
    let requestData;
    let data = [];
    let key = 'name';
    let valueKey = null;

    switch (interaction.commandName) {
      case 'item':
        requestData = require('../lib/request/item/request-search-item');
        break;

      case 'vehicle':
      case 'ship':
      case 'fahrzeug':
      case 'schiff':
        valueKey = 'uuid';
        requestData = require('../lib/request/vehicle/request-search-vehicle');
        break;

      case 'galactapedia':
        key = 'title';
        valueKey = 'id';
        requestData = require('../lib/request/galactapedia/request-search-galactapedia');
        break;

      default:
        return;
    }

    if (focusedValue.length > 0) {
      data = (await requestData(focusedValue)).result;
    }

    await interaction.respond(
      data.map((res) => ({
        name: res[key],
        value: res[valueKey ?? key] ?? res[key],
      })),
    );
  },
};
