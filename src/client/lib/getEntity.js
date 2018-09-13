
module.exports = function getEntity(get, entity) {
  let fields = get(`/${entity}/action/data`)
  let errors = get(`/${entity}/errors`)

  let a = {
    fields: {},
    errors: {}
  }

  function getVal(field) {
    return get(`/${entity}/action/data/${field}/value`)
  }

  function getErrText(field, code) {
    return get(`/${entity}/errors/${field}/${code}`)
  }

  function getErr(field) {
    let err = get(`/${entity}/action/data/${field}/error`)
    if (err) {
      return getErrText(field, err.keyword) || `${field} are o eroare(${err.keyword}).`
    } else {
      return false
    }
  }

  return {
    val: getVal,
    errText: getErrText,
    err: getErr
  }
}
