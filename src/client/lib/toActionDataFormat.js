

/**
 * Changes the object structure to the action data format
 * according to the validation schema:
 * [propCategory]:
 *   [propName]:
 *      value:
 */

module.exports = obj => {
  if (!obj) {
    return
  }
  return Object.keys(obj).reduce((acc, x) => {
    let item = obj[x]
    if (!item) {
      return acc
    }
    acc[x] = Object.keys(item).reduce((acc2, y) => {
      acc2[y] = {
        value: item[y]
      }
      return acc2
    }, {})
    return acc
  }, {})
}
