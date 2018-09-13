module.exports = function patchTemplate(op, path) {
  return val => ({
    op,
    path,
    value: val
  })
}
