import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

module.exports = {
  args: {
    config: '/config'
  },
  fn: stream
    .chain(({ config }, lib) => observer(o => {

      let focused = 
      document.body.addEventListener('focus', x => {
        if (x && x.target) {
          setTimeout(() => {
            let el = x.target
            o.next({
              op: 'add',
              path: '/focused',
              value: {
                field: el.dataset.field,
                entity: el.dataset.entity
              }
            })
          })
        }
      }, true)
      document.body.addEventListener('blur', x => {
        setTimeout(() => {
          if (document.activeElement === document.body) {
            o.next({
              op: 'remove',
              path: '/focused'
            })
          }
        }, 300)
      }, true)


    }))
}
