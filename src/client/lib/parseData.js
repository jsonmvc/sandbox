
module.exports = function parseData(data) {
  if (!data) {
    return
  }

  data = Object.keys(data).reduce((acc, x) => {
    let ns = data[x]
    acc[x] = Object.keys(ns).reduce((acc2, y) => {
      if (ns[y].value !== undefined) {
        acc2[y] = ns[y].value
      }
      return acc2
    }, {})
    return acc
  }, {})

  return data
}
