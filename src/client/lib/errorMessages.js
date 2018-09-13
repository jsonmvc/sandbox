
module.exports = function errorMessages(errors, key, fields) {
  let result = []

  if (key === '_required') {
    let missing = errors
      .map(x => `${x.dataPath}/${x.params.missingProperty}`)
      .map(x => {
        x = x.split('/')
        x.shift()
        return x
      })
      .map(x => '"' + fields[x[0]][x[1]].label + '"')
      .join(', ')

    let err = 'Urmatoarele campuri trebuie completate: ' + missing
    result.push(err)
  } else if (key === '_if') {
    console.log('If field ', errors, key)
  } else {
    console.log('Any other key', key)
    errors.forEach(y => {
      let path = y.dataPath.split('/')
      path.shift()
      let field = fields[path[0]][path[1]]
      let err = 'are o eroare'
      if (y.keyword === 'minLength') {
        err = 'trebuie sa aiba minim ' + y.params.limit + ' caractere'
        result.push('Campul "' + field.label + '" ' + err + '.')
      } else if (y.keyword === 'type') {
        let type = y.params.type === 'string' ? 'text' : 'cifre'
        err = 'trebuie sa contina ' + type
        result.push('Campul "' + field.label + '" ' + err + '.')
      } else if (y.keyword === 'metatype') {
        result.push(y.message)
      } else {
        console.log('[tipul nesuportat]', y)
        result.push('Campul "' + field.label + '" ' + err + '.')
      }
    })

    return result
  }

  return result
}
