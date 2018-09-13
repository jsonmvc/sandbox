
import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

function updatePath(o, path) {
  return x => {
    if (x.docs.length > 0) {
      x.docs.forEach(y => {
        o.next({
          op: 'add',
          path: path + '/' + y.id,
          value: y.data()
        })
      })
    } else {
      o.next({
        op: 'remove',
        path
      })
    }
  }
}

function link(o, doc, path) {
  doc.onSnapshot(updatePath(o, path), e => {
    console.error('Link error', e)
  })
}

function initUser(get, db, o, uid) {
  let ref = db.doc('users/' + uid)
  ref.onSnapshot(x => {

    if (!x.exists || !x.data()) {
      setTimeout(() => initUser(get, db, o, uid), 50)
      o.next({
        op: 'remove',
        path: '/user'
      })
      return
    }

    let result = x.data()

    let patches = [{
      op: 'add',
      path: '/firebase/auth/state',
      value: 'succesful'
    }, {
      op: 'add',
      path: '/user/profile',
      value: result.profile
    }, {
      op: 'add',
      path: '/user/id',
      value: result.id
    }]

    if (result.token) {
      patches.push({
        op: 'add',
        path: '/user/token',
        value: result.token
      })
    }

    if (result.admin) {
      patches.push({
        op: 'add',
        path: '/user/admin',
        value: result.admin
      })
    }

    patches.push({
      op: 'add',
      path: '/router/location',
      value: 'user-invoices'
    })

    o.next(patches)

    window.loggedIn = true
  })
}

module.exports = {
  args: {
    init: '/firebase/init'
  },
  fn: stream
    .filter(({ init }) => init === true)
    .chain((x, lib) => observer(o => {
      let db = FIREBASE.firestore()
      let routes = lib.get('/router/default')

      if (sessionStorage.getItem('signedin')) {
        o.next({
          op: 'add',
          path: '/firebase/auth/state',
          value: 'pending'
        })
      }

      window.loggedIn = false
      FIREBASE.auth().onAuthStateChanged(user => {
        console.log('Auth state changed', user)
        if (!user) {
          window.loggedIn = false
          o.next({
            op: 'add',
            path: '/firebase/auth/state',
            value: 'unauthorized'
          })
          sessionStorage.removeItem('signedin')
          console.log('[AUTH] Unauthrorized')
          return
        }

        sessionStorage.setItem('signedin', lib.get('/time/ms'))

        o.next({
          op: 'add',
          path: '/router/history',
          value: []
        })

        initUser(lib.get, db, o, user.uid)
    })
  }))
}
