import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

module.exports = {
  args: {
    sync: '/firebase/sync',
    init: '/firebase/init'
  },
  fn: stream
    .filter(({ sync, init }) => !!sync && !!init)
    .chain(({ sync }, lib) => observer(o => {

      Object.keys(sync).forEach(entityName => {
        let entity = sync[entityName]
        
        o.next({
          op: 'add',
          path: '/actions/succesful',
          value: []
        })
        lib.on(`/${entityName}/action/sync/success`, y => {
          if (y === true) {
            setTimeout(() => {
              o.next([{
                op: 'remove',
                path: `/${entityName}/action`
              }, {
                op: 'add',
                path: '/actions/succesful/-',
                value: entityName
              }])
              
            }, 1000)
          }
        })

        

      })

    }))
}