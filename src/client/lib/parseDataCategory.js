
module.exports = function parseDataCategory(data) {
  if (!data) {
    return
  }

  data = Object.keys(data).reduce((acc, x) => {
    let item = data[x]
    if (item.value !== undefined) {
      acc[x] = item.value
    }
    return acc
  }, {})

  return data
}
