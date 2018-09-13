
module.exports = {
  args: {
    submit: '/users/session/login/submit'
  },
  fn: ({ submit }, { get }) => {
    if (!submit) {
      return
    }

    let email = get('/users/action/data/profile/email/value')
    let password = get('/users/action/data/protected/password/value')

    console.log(email, password)
    db.patch([{
      op: 'add',
      path: '/users/session/login/pending',
      value: true
    }])

    let result
    try {
      result = FIREBASE.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        return {
          error: true,
          code: error.code
        }
      }).then(x => {
        if (x.error) {
          return [{
            op: 'add',
            path: '/users/session/login/error',
            value: x.code
          }, {
            op: 'add',
            path: '/users/session/login/pending',
            value: false
          }]
        } else {
          return [{
            op: 'add',
            path: '/users/session/login/success',
            value: true
          }, {
            op: 'add',
            path: '/users/session/login/pending',
            value: false
          }]
        }
      })
    } catch(e) {
      return [{
        op: 'add',
        path: '/users/session/login/error',
        value: e.code
      }, {
        op: 'add',
        path: '/users/session/login/pending',
        value: false
      }]
    }

    return result
  }
}
