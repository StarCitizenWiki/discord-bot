const axios = require('../request')

const requestData = async (args) => {
    const result = await axios.post('galactapedia/search', {
            query: args
        },
        {
            params: {
                include: 'related_articles,english,categories,properties',
                limit: 1,
            },
        })
        .catch(() => {
            return null
        })

    if (typeof result?.data === 'undefined' || typeof result?.data?.error !== 'undefined' || result.status !== 200 || result.data.data.length === 0) {
        return null
    }

    return result.data.data
}

module.exports = requestData
