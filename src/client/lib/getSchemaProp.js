module.exports = function getSchemaProp(schema, prop) {
  let value

  if (schema.properties) {
    value = schema.properties[prop]
  } else if (schema.patternProperties) {
    let props = Object.keys(schema.patternProperties)

    if (props.length > 1) {
      throw new Error('Too many pattern properties at the on the same object ' + JSON.stringify(schema))
    }

    value = schema.patternProperties[props[0]]
  }

  return value
}
