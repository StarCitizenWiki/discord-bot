# discord-bot
A Star Citizen Bot using data from https://api.star-citizen.wiki

## Commands
* `sc_ship name`
  * Get information about a ship or vehicle by name
* `sc_manufacturer name`
  * Get information about a manufacturer by name
* `sc_system name`
  * Get information about a system by name
* `sc_stats`
  * Get information about the current funding and fleet stats
* `sc_help`
  * List available commands

Note: Only "official" data (shipmatrix for vehicles / ships and starmap for systems), will be returned. 
  
## config.json
```json
{
  "prefix": "sc_",
  "token": "Bot Token",
  "api_token": null,
  "api_url": "https://api.star-citizen.wiki",
  "wiki_url": "https://star-citizen.wiki",
  "locale": "de_DE",
  "footer": {
    "text": "Daten von https://api.star-citizen.wiki",
    "icon_url": "https://cdn.star-citizen.wiki/favicon.png"
  }
}
```

## Build
`docker build -t scw/discord-bot .`

## Run
`docker run --name discord-bot -d -v /opt/discord-bot/config.json:/home/node/app/config.json scw/discord-bot `
