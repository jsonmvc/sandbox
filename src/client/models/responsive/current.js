
module.exports = {
  args: {
    matched: '/responsive/matched'
  },
  fn: ({ matched }) => {
    if (!matched) {
      return
    }
    return matched[matched.length - 1]
  }
}
