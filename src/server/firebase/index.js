const functions = require('firebase-functions')
const admin = require('firebase-admin')
const app = admin.initializeApp(functions.config().firebase)
const fs = require('fs')
const path = require('path')

fs.readdirSync(__dirname + '/src/firestore')
    .map(fileName => ({ name: path.parse(fileName).name, def: require(path.join(__dirname, '/src/firestore/', fileName)) }))
    .forEach(module => exports[module.name] = functions.firestore.document(module.def.url)[module.def.ev](module.def.fn(app)))

//fs.readdirSync('./src/realtime')
//    .map(fileName => ({ name: fileName, def: require(fileName) }))
//    .forEach(module => exports[module.name] = functions.firestore.document(module.def.url)[module.def.ev](module.def.fn(app)))
