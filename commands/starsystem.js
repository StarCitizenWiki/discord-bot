const requestImage = require('../lib/request/request-image')
const createEmbed = require('../lib/embed/starsystem/starsystem-embed')
const createDTO = require('../lib/dto/starsystem/starsystem-api-dto')
const requestData = require('../lib/request/starsystem/request-starsystem')
const requestLinksData = require('../lib/request/starsystem/request-starsystem-links')
const createSystemLinksEmbed = require('../lib/embed/starsystem/starsystem-links-embed')
const createSystemLinkDto = require('../lib/dto/starsystem/starsystem-links-api-dto')
const isNumeric = require('../lib/is-numeric')

module.exports = {
  name: 'system',
  description: 'Erzeugt eine Informationskarte zu einem bestimmten Sternensystemnamen.\nEs können nur solche Sternensysteme angezeigt werden, welche in der Starmap verfügbar sind.\nBei der Angabe keiner Argumente werden alle verfügbaren Sternensysteme ausgegeben.',
  description_short: `\`$PREFIXsystem\` - Auflistung aller Sternensysteme\n\`$PREFIXsystem [Nr.]\` - Ändern der angezeigten Seite\n\`$PREFIXsystem [Name]\` - Informationen zu einzelnem Sternensystem`,
  aliases: ['sys', 'systeme', 'systems'],
  usage: 'Sternensystem',
  cooldown: 3,
  examples: [
    `Ausgabe aller Sternensyeteme: \`$PREFIXsystem\``,
    `Ausgabe aller Sternensyeteme auf Seite 2: \`$PREFIXsystem 2\``,
    `Ausgabe des Sternensyetems Sol: \`$PREFIXsys SOL\``,
    `Ausgabe des Sternensystems Stanton: \`$PREFIXsystem Stanton\``,
  ],
  async execute (message, args) {
    if (!args.length || (typeof args[0] === 'string' && isNumeric(args[0]) && args.length === 1)) {
      const linkData = await requestLinksData(args)

      return message.channel.send(createSystemLinksEmbed(createSystemLinkDto(linkData)))
    }

    const name = args.join(' ')

    const result = await requestData(name)
    const image = await requestImage(`${name}|${name} (Sternensystem)`)

    const reply = createEmbed(createDTO(result.data, image))

    message.channel.send(reply)
  },
}
