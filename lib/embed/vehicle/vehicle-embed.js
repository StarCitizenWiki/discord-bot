const Discord = require('discord.js')
const { footer, wiki_url } = require('../../../config.json')

const formatCrew = (data) => {
  if (data.crew_min === 0 && data.crew_max === 0) {
    return '-'
  }

  if (data.crew_min === data.crew_max) {
    return data.crew_max
  }

  let crewString = ''

  if (data.crew_min !== 0) {
    crewString = `${data.crew_min} - `
  }

  if (data.crew_max !== 0) {
    crewString = `${crewString}${data.crew_max}`
  }

  return crewString
}

const formatPrice = (price) => {
  if (price === 0) {
    return '-'
  }

  return `${price.toLocaleString('de-DE')}$`
}

const formatSpeed = (speed) => {
  if (speed === 0) {
    return '-'
  }

  return `${(Math.round(speed * 3.6)).toLocaleString('de-DE')} km/h`
}

const formatWeight = (weight) => {
  if (weight === 0) {
    return '-'
  }

  return `${weight.toLocaleString('de-DE')} Kg`
}

const formatCargo = (cargo) => {
  if (cargo === 0) {
    return '-'
  }

  return `${cargo.toLocaleString('de-DE')} SCU`
}

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    timestamp: data.timestamp,
    title: data.name,
    description: data.description,
    type: 'link',
    url: `${wiki_url}/${encodeURIComponent(data.name.replace(/\s/g, '_'))}`,
    author: {
      name: `${data.manufacturer} (${data.manufacturer_code})`
    },
    footer
  })

  reply
    .addField('Länge', data.length + ' m', true)
    .addField('Breite', data.beam + ' m', true)
    .addField('Höhe', data.height + ' m', true)

    .addField('Besatzung', formatCrew(data), true)
    .addField('Kampf Geschw.', formatSpeed(data.scm), true)
    .addField('Max. Geschw.', formatSpeed(data.afterburner), true)

    .addField('Gewicht', formatWeight(data.mass), true)
    .addField('Frachtkapazität', formatCargo(data.cargo), true)
    .addField('Aktueller Preis', formatPrice(data.price), true)

  let foci = data.foci
  if (data.foci.length > 0) {
    foci = foci.join(' und ')
  } else {
    foci = '-'
  }

  reply
    .addField('Hersteller', `[${data.manufacturer}](${wiki_url}/${encodeURIComponent(data.manufacturer.replace(/\s/g, '_'))})`, true)
    .addField('Fokus', foci, true)
    .addField('Größe', data.size, true)
    .addField('Status', data.status, true)

  const links = [
    `[Wiki](${wiki_url}/${encodeURIComponent(data.name.replace(/\s/g, '_'))})`,
    `[Fleet Yard](https://fleetyards.net/ships/${encodeURIComponent(data.name.replace(/\s/g, '-').toLowerCase())})`
  ]

  let pledgeAdded = false
  let youtubeAdded = false

  data.sources.forEach(source => {
    if (source.includes('Broschüre')) {
      links.push(`[Broschüre](${source})`)
    }

    if (source.includes('/pledge/ships') && !source.includes('#') && !pledgeAdded) {
      pledgeAdded = true
      links.push(`[Pledge Store](${source})`)
    }

    if (source.includes('youtube') && !youtubeAdded) {
      youtubeAdded = true
      links.push(`[YouTube](${source})`)
    }
  })

  reply
    .addField('Links', links.join(' · '))

  if (data.image !== null) {
    reply.setImage(data.image)
  }

  return reply
}

module.exports = createEmbed
