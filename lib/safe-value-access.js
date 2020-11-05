/**
 * Wrapper to access keys of an object
 * Supports dot notation to access nested properties
 *
 * @param key
 * @param data
 * @param def default value to return
 * @param withArray
 * @returns {null|*}
 */
const safeValueAccess = (key, data, def = null, withArray = false) => {
  if (typeof key === 'string') {
    key = key.split('.')
  }

  if (Object.prototype.hasOwnProperty.call(data, key[0]) &&
    typeof data[key[0]] === 'object'
    && (withArray ? true : !Array.isArray(data[key[0]]))
    && data[key[0]] !== null) {
    const parent = key.shift()

    return safeValueAccess(key, data[parent], def)
  }

  if (Object.prototype.hasOwnProperty.call(data, key[0]) && data[key[0]] !== null) {
    return data[key[0]]
  }

  return def
}

module.exports = safeValueAccess
