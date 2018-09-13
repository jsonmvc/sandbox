
const validator = {
  idCard: x => {
    if (!x) {
      return 'Cartea de identitate nu a fost completata'
    } else if (!x.series || x.series.match('^[A-Z]{2}$') === null) {
      return 'Seria cartii de identitate trebuie formata din doua litere ex: AD, PD, CT'
    } else if (!x.number || x.number.match('^[0-9]{6}$') === null) {
      return 'Numarul cartii de identitate este formata din 6 cifre ex: 123456'
    }
  }
}

function errPatch(e) {
  return [{
    op: 'add',
    path: '/account/edit/error',
    value: e
  }, {
    op: 'remove',
    path: '/account/edit/submit'
  }]
}

module.exports = {
  args: {
    submit: '/account/edit/submit'
  },
  fn: ({ submit }, { get }) => {

    if (!submit) {
      return
    }

    let data = get('/account/edit/data')

    if (!data) {
      return errPatch('Nu au fost completate date pentru a fi salvate.')
    }

    if (data.idCard) {
      let idCard = get('/user/profile/idCard')
      data.idCard = Object.assign({}, idCard, data.idCard)
    }

    for (let i in data) {
      const err = validator[i] && validator[i](data[i])
      if (err) {
        return errPatch(err)
      }
    }

    return new Promise((resolve, reject) => {
      const uid = get('/user/id')
      const ref = FIREBASE.firestore().doc('users/' + uid)
      const updates = Object.keys(data).reduce((acc, x) => {
        acc['profile.' + x] = data[x]
        return acc
      }, {})

      ref.update(updates).then(x => {
        resolve([{
          op: 'remove',
          path: '/account/edit'
        }])
      }).catch(e => {
        console.error(e)
      })

    })
  }
}