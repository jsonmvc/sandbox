import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

module.exports = {
  args: {
    init: '/firebase/init'
  },
  fn: stream
    .filter(({ init }) => init)
    .chain((x, lib) => observer(o => {
      let db = FIREBASE.firestore()

      db.collection('users')
        .onSnapshot(x => {
          x.docChanges.forEach(change => {
            let id = change.doc.id
            let data = change.doc.data()
            if (change.type === 'removed') {
              o.next({
                op: 'remove',
                path: '/users/list/' + id,
              })
            } else {
              //console.log(data);
              db.collection('users/' + id + '/meta').onSnapshot(y => {
                if (!y.docChanges[0]) {
                  return
                }
                data.created = y.docChanges[0].doc.data().timestamp
                o.next({
                  op: 'add',
                  path: '/users/list/' + id,
                  value: data
                })
              })
            }
          })
        })
    }))
}
