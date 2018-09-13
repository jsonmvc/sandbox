const getSubSchema = require('./getSubSchema')
const Ajv = require('ajv')
const metaTypes = {
  invoiceNumber: require('./../metatypes/invoiceNumber'),
  invoiceId: require('./../metatypes/invoiceId')
}

module.exports = function entityErrors(schemaPath) {
  return function (_ref) {
    var data = _ref.data
    var schema = _ref.schema

    schema = getSubSchema(schema, schemaPath + '/entity')

    var ajv = new Ajv({
      allErrors: true,
      jsonPointers: true,
      // verbose: true,
      // format: 'full'
    })

    ajv.addKeyword('metatype', {
      validate: function validateMetatype(schema, data) {
        let type = metaTypes[schema]
        if (type) {
          let result = type.call(validateMetatype, data)
          return result
        } else {
          console.error(`Metatype ${schema} does not exists`)
          return true
        }
      },
      errors: true
    })

    var result = ajv.validate(schema, data)

    if (!result && ajv.errors) {
      let errors = ajv.errors.reduce((acc, x) => {
        let c = x.dataPath.split('/')
        c.shift()
        let cat = c[0] || 'root'
        let field = c[1]

        if (!acc[cat]) {
          acc[cat] = {}
        }
        if (!field) {
          if (!acc[cat]['_' + x.keyword]) {
            acc[cat]['_' + x.keyword] = []
          }
          acc[cat]['_' + x.keyword].push(x)
        } else { 
          if (!acc[cat][field]) {
           acc[cat][field] = []
          }
          acc[cat][field].push(x)
        }
        return acc
      }, {})

      return errors
    } else {
      return;
    }
  }
}
