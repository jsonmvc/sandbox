import jsonmvc from 'jsonmvc'
import time from 'jsonmvc-module-time'
import ui from 'jsonmvc-module-ui'

/**
 * DO NOT REMOVE
 * see gulp task build:entry
 */
__GET_MODULE_FUNCTION_IMPORT__

// require('./assets/js/google-analytics.js')

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

db.on('/err', x => console.log('DB error', x))
