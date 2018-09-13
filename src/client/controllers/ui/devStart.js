import id from 'lib/id'

module.exports = {
  args: {
    state: '/firebase/auth/state'
  },
  fn: ({ state }, { get }) => {
    return

    if (process.env.NODE_ENV !== 'development') {
      return
    }

    if (state !== 'succesful') {
      return
    }

    let patches = [{
      op: 'add',
      path: '/router/location',
      value: 'user-home'
    }]

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(patches)
      }, 4000)
    })
  }
}
