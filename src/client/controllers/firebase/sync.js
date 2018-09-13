import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

function parseValues(data) {
  return Object.keys(data).reduce((acc, x) => {
    Object.keys(data[x]).forEach( y => {
      let { value } = data[x][y]
      if (value !== undefined) {
        if (!acc[x]) {
          acc[x] = {}
        }
        acc[x][y] = value
      }
    })
    return acc
  }, {})
}

module.exports = {
  args: {
    sync: '/firebase/sync',
    init: '/firebase/init'
  },
  fn: stream
    .filter(({ sync, init }) => !!sync && !!init)
    .chain(({ sync }, lib) => observer(o => {
      let db = FIREBASE.firestore()

      Object.keys(sync).forEach(entityName => {
        let entity = sync[entityName]
        if (entity === true) {
          entity = {
            collection: entityName
          }
        }

        lib.on(`/${entityName}/action/submit`, y => {
          if (!y) {
            return
          }

          let action = lib.get(`/${entityName}/action`)

          if (action.sync) {
            return
          }

          if (action.errors) {
            return
          }

          if (!action.type) {
            console.error('The initiated action is badly formatted. Expecting "type" to be update/create/remove', action)
            return
          }

          if (action.type === 'update' && !action.id) {
            console.error('The "update" or "remove" type requires the "id" of the entity', action)
            return
          }

          let data = parseValues(action.data)

          if (Object.keys(data).length === 0 && action.type !== 'remove') {
            o.next({
              op: 'remove',
              path: `/${entityName}/action/submit`
            })
            return
          }

          let path
          let ref
          if (action.id) {
            path = `${entity.collection}/${action.id}`
            ref = db.doc(path)
          } else {
            path = entity.collection
            ref = db.collection(path).doc()
          }

          if (entity.type) {
            data.type = entity.type
          }

          data.id = ref.id

          o.next({
            op: 'add',
            path: `/${entityName}/action/sync`,
            value: {
              sentAt: lib.get('/time/ms'),
              path,
              data
            }
          })

          let dbAction

          if (action.type === 'remove') {
            dbAction = ref.delete()
          } else {
            dbAction = ref.set(data, {
              merge: true
            })
          }

          dbAction.catch(e => {
            o.next({
              op: 'merge',
              path: `/${entityName}/action/sync`,
              value: {
                error: e,
                receivedAt: lib.get('/time/ms')
              }
            })
          }).then(x => {
            o.next({
              op: 'merge',
              path: `/${entityName}/action/sync`,
              value: {
                receivedAt: lib.get('/time/ms'),
                success: true
              }
            })
          })
        })
      })
    }))
}
