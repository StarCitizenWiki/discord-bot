# discord-bot
<p align="center">
    <a href="https://discord.com/api/oauth2/authorize?client_id=770734131213500466&permissions=52224&scope=bot" alt="Add Bot">
        <img src="https://img.shields.io/static/v1?label=Discord&color=7289DA&message=Add%20Bot&logo=discord" />
    </a>
    <a href="https://hub.docker.com/r/scwiki/discord-bot" alt="Docker Hub">
        <img src="https://img.shields.io/docker/pulls/scwiki/discord-bot" />
    </a>
</p>

A Star Citizen Discord Bot using data from [the Star Citizen Wiki API](https://api.star-citizen.wiki).

[German Citizen Spotlight text](docs/german_spotlight_text.md)

## Features
### Ship and Vehicle Cards
Command `/schiff Pioneer`

![Pioneer](docs/ship_pioneer.png)

Command `/fahrzeug Ursa Rover`

![Pioneer](docs/vehicle_ursa_rover.png)

#### Listing all available ships and vehicles
Calling the command without arguments outputs a list of all available ships or vehicles.  

Command `/schiff`

![Ships](docs/ships.png)

### Starsystem Cards
Command `/system Sol`

![Pioneer](docs/sol_system.png)

#### Listing all available systems
Calling the command without arguments outputs a list of all available starsystems.  

Command `/system`

![Ships](docs/systems.png)

### Manufacturer Cards
Command `/hersteller RSI`

![RSI](docs/manufacturer_rsi.png)

#### Listing all available manufactuer
Calling the command without arguments outputs a list of all available manufacturer.  

Command `/hersteller`

![Ships](docs/manufacturer.png)

### Comm-Link Cards
Command `/comm-link`

![Comm-Links](docs/comm_links.png)

#### Channel Notifications
Additionally you can a channel to receive notifications if new comm-links were published.  
`/comm-link add` -> Adds the current channel to receive notifications.  
`/comm-link remove` -> Removes the current channel from receiving notifications.  

## Commands
* `/schiff name`
  * Get information about a ship or vehicle by name
* `/hersteller name`
  * Get information about a manufacturer by name
* `/system name`
  * Get information about a system by name
* `/stats`
  * Get information about the current funding and fleet stats
* `/status`
  * Get information about the current server status
* `/volk`
  * Get information about all available nations in the wiki
* `/person`
  * Get information about all available persons in the wiki
 
  
## config.json
```json
{
  "token": "Bot Token",
  "api_token": null,
  "api_url": "https://api.star-citizen.wiki",
  "wiki_url": "https://star-citizen.wiki",
  "locale": "de_DE",
  "footer": {
    "text": "Daten von https://star-citizen.wiki",
    "icon_url": "https://cdn.star-citizen.wiki/favicon.png"
  }
}
```

## Build
`docker build -t scw/discord-bot .`

## Run
`docker run --name discord-bot -d -v /opt/discord-bot/config.json:/home/node/app/config.json scw/discord-bot `

`docker run --name discord-bot --restart unless-stopped -d -v /opt/discord-bot/config.json:/home/node/app/config.json  -v /opt/discord-bot/db.json:/home/node/app/db.json scw/discord-bot`
