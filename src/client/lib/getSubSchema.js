const getSchemaProp = require('./getSchemaProp')

module.exports = function getSubSchema(schema, path) {
  let parts = path.split('/')
  let cur = schema

  parts.shift()

  let part
  while(parts.length) {
    part = parts.shift()
    cur = getSchemaProp(cur, part)

    if (!cur) {
      break
    }
  }

  return cur
}
