import jsonmvc from 'jsonmvc'
import time from 'jsonmvc-module-time'
import ui from 'jsonmvc-module-ui'
import jsonmvcChanges from 'jsonmvc-util-changes'

/**
 * DO NOT REMOVE
 * see gulp task build:entry
 */
__GET_MODULE_FUNCTION_IMPORT__


/**
 * Setup system
 */
let modules = [
  time,
  ui,
  getModule()
]

require('css/styles.css')

let instance = jsonmvc(modules)

function hotReload(x, mod) {
  let start = performance.now()
  let changes = jsonmvcChanges(instance, getModule())
  instance.update(changes)
  console.log('Finished hot reload after', performance.now() - start)
}

if (module.hot) {
  __MODULE_HOT_ACCEPT__
}

db.on('/err', x => console.log('DB error', x))
