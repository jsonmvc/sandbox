const getSubSchema = require('./getSubSchema')
const Ajv = require('ajv')

module.exports = function fieldError(parentPath, schemaPath, fieldName) {

  if (!parentPath || !schemaPath || !fieldName) {
    throw new Error('Arguments are not defined for this model')
  }

  return function(_ref) {
    var data = _ref.data,
        schema = _ref.schema,
        submit = _ref.submit;

    let parts = parentPath.split('/')
    parts.shift()
    parts.shift()

    let parentSchema = schema
    for (let i = 0; i < parts.length; i += 1) {
      parentSchema = parentSchema[parts[i]]
      if (!parentSchema) {
        throw new Error('Parent schema does not exist for ', parentPath, schemaPath, fieldName)
      }
    }
    
    if (parentSchema && parentSchema.required && parentSchema.required.indexOf(fieldName) > -1 && (data === undefined || data === null)) {
      return {
        keyword: 'required',
        messsage: 'Field is required'
      }
    }

    if (data == undefined) {
      return;
    }

    parts = schemaPath.split('/')
    parts.shift()
    parts.shift()
    let fieldSchema = _ref.schema
    for (let i = 0; i < parts.length; i += 1) {
      fieldSchema = fieldSchema[parts[i]]
      if (!fieldSchema) {
        throw new Error('Field schema does not exist for ', _ref.schema, schemaPath)
      }
    }

    if (!fieldSchema) {
      debugger
    }

    var ajv = new Ajv()
    var result = ajv.validate(fieldSchema, data)

    if (!result && ajv.errors) {
      return ajv.errors[0]
    } else {
      return;
    }
  }
}
