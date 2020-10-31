const axios = require('./request')

const requestStarsystemLinksData = async (args) => {
  let page = 0
  if (args) {
    page = Math.abs(Number.parseInt(args[0], 10))
  }

  const apiData = await axios.get('starmap/starsystems', {
    params: {
      transformer: 'link',
      limit: 25,
      page
    }
  })
    .catch(error => {
      return error
    })

  if (apiData.status !== 200) {
    throw apiData
  }

  return apiData.data
}

module.exports = requestStarsystemLinksData
