
module.exports = function toActionValue(obj) {
  if (!obj) {
    return
  }

  let result = Object.keys(obj).reduce((acc, x) => {
    let cat = obj[x]
    if (cat === undefined) {
      return acc
    }
    acc[x] = Object.keys(cat).reduce((acc2, y) => {
      let field = cat[y]
      if (field === undefined) {
        return acc2
      }
      acc2[y] = {
        value: field
      }
      return acc2
    }, {})
    return  acc
  }, {})

  return result
}
