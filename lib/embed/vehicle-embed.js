const Discord = require('discord.js')
const { footer, wiki_url } = require('../../config.json')

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

const formatSpeed = (speed) => {
  if (speed === 0) {
    return '-'
  }

  return `${(speed * 3.6).toLocaleString('de-DE')} km/h`
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
    url: `${wiki_url}/${encodeURIComponent(data.name.replace(' ', '_'))}`,
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
    .addField('Geschwindigkeit', formatSpeed(data.scm), true)
    .addField('Afterburner', formatSpeed(data.afterburner), true)

    .addField('Gewicht', formatWeight(data.mass), true)
    .addField('Frachtkapazität', formatCargo(data.cargo), true)

  let foci = data.foci
  if (data.foci.length > 0) {
    foci = foci.join(' und ')
  } else {
    foci = '-'
  }

  reply.addField('Fokus', foci, true)

  reply
    .addField('Hersteller', `[${data.manufacturer}](${wiki_url}/${encodeURIComponent(data.manufacturer.replace(' ', '_'))})`, true)
    .addField('Größe', data.size, true)
    .addField('Status', data.status, true)
    .addField('Link zum Wikiartikel', `[${data.name}](${wiki_url}/${encodeURIComponent(data.name.replace(' ', '_'))})`)

  if (data.image !== null) {
    reply.setImage(data.image)
  }

  return reply
}

module.exports = createEmbed
