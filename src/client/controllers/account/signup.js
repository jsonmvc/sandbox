import ajax from '@fdaciuk/ajax'

module.exports = {
  args: {
    submit: '/users/session/signup/submit'
  },
  fn: ({ submit }, { get }) => {
    if (!submit) {
      return
    }

    let data = get('/users/action/parsedData')
    let errors2 = get('/users/action/errors')

    let email = data.profile.email
    let pass = data.protected.password
    let passConfirmation = data.protected.confirmPassword

    if (pass !== passConfirmation) {
      return {
        op: 'add',
        path: '/users/session/signup/errorCode',
        value: 'auth/password-not-confirmed'
      }
    }

    let fdb = FIREBASE.firestore()
  }
}
