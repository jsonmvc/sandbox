
module.exports = {
  args: {
    submit: '/forgotPassword/submit'
  },
  fn: ({ submit }, { get }) => {
    if (!submit) {
      return
    }

    let email = get('/forgotPassword/email')
    let result
    try {
      result = FIREBASE.auth().sendPasswordResetEmail(email, {
        url: window.location.origin + '/visitor/login?email=' + email
      }).catch(e => {
        return {
          error: true,
          code: e.code
        }
      }).then(x => {
        if (x && x.error) {
          return {
            op: 'add',
            path: '/forgotPassword/error',
            value: x.code
          }
        }
        return [{
          op: 'add',
          path: '/forgotPassword/success',
          value: true
        }, {
          op: 'remove',
          path: '/forgotPassword/error'
        }]
      })
    } catch (e) {
      return {
        op: 'add',
        path: '/forgotPassword/error',
        value: e.code
      }
    }

    return result
  }
}