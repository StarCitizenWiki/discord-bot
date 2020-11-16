const axios = require('axios')
const { wiki_url } = require('../../config.json')

const instance = axios.create({
  baseURL: wiki_url,
  timeout: 2500,
})

const requestImage = async (title) => {
  title = title
    .split(' ')
    .join('_')

  const result = await instance.get('/api.php', {
    params: {
      action: 'query',
      format: 'json',
      prop: 'pageimages',
      piprop: 'thumbnail',
      formatversion: 2,
      titles: title,
    },
  })
    .catch(() => {
      return null
    })

  if (result.status !== 200 || result.data.batchcomplete !== true || result.data.query.pages.length === 0) {
    return null
  }

  const data = result.data

  let image = null

  if (typeof data.query.normalized !== 'undefined') {
    title = data.query.normalized[0].to
  }

  data.query.pages.forEach(page => {
    if (page.title === title.replace(/_/g, ' ') && typeof page.thumbnail !== 'undefined') {
      image = page.thumbnail.source.replace('50px-', '800px-')
    }
  })

  return image
}

module.exports = requestImage
