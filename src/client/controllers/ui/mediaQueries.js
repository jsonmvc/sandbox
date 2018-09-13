import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'
import enquire from 'enquire.js'

module.exports = {
  args: {
    responsive: '/config/responsive'
  },
  fn: stream
    .chain(({ responsive }, { get, on }) => observer(o => {

      Object.keys(responsive).forEach(x => {
        let screen = responsive[x]
        let media

        if (typeof screen === 'string') {
          media = `screen and (min-width: ${screen})`
        } else if (typeof screen === 'object') {
          media = 'screen and '
          let conds = []
          if (screen.min) {
            conds.push(`(min-width: ${screen.min})`)
          }
          if (screen.max) {
            conds.push(`(max-width: ${screen.max})`)
          }

          let query = conds.reduce((acc, x, i, arr) => {
            acc += ' ' + x
            if (i !== arr.length - 1) {
              acc += ' and'
            }
            return acc
          }, '')

          media = media + query
        }

        enquire.register(media, {
          match: function() {
            let current = get('/responsive/matched')

            if (!current) {
              current = []
            }

            if (current.indexOf(x) === -1) {
              current.push(x)
              o.next({
                op: 'add',
                path: '/responsive/matched',
                value: current
              })
            }

          },
          unmatch: function() {
            let current = get('/responsive/matched')

            if (!current) {
              current = []
            }

            if (current.indexOf(x) !== -1) {
              current.splice(current.indexOf(x), 1)
              o.next({
                op: 'add',
                path: '/responsive/matched',
                value: current
              })
            }
          }
        })

      })

    }))

}
