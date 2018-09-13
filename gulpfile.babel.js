'use strict';

import webpack from 'webpack'
import gulp from 'gulp'
import gutil from 'gulp-util'
import fs from 'fs'
import del from 'del'
import yaml from 'js-yaml'
import path from 'path'
import mkdirp from 'mkdirp'
import defaults from 'json-schema-defaults'
import { buildSchema, buildValidation } from 'jsonmvc-schema'
import gulpsync from 'gulp-sync'
import watch from 'gulp-watch'
import rimraf from 'rimraf'
import { Config, environment } from 'webpack-config'

process.env.TAILWIND_FLAVOUR = 'tachyons'

import WebpackDevServer from 'webpack-dev-server'

const cert = require('./firebase-credentials.dev.json')
const sync = gulpsync(gulp).sync;

var recursive = require("recursive-readdir");

environment.setAll({
    env: function() {
        return process.env.NODE_ENV
    }
});

const webpackVendorConfig = new Config().extend('./webpack.dll.js')

process.env.CLIENT_PATH = __dirname + '/src/client'
process.env.SCHEMA_PATH = __dirname + '/src/schema'
process.env.SERVER_PATH = __dirname + '/src/server'
process.env.DIST_PATH = __dirname + '/www'
process.env.HOST_IP = 'localhost'
process.env.HOST_PORT = '8080'
process.env.ROOT_ELEMENT_ID = 'app'
process.env.APP_TITLE = 'The Mood App'

const placeholders = {
  '__FIREBASE_APIKEY__': cert.apiKey,
  '__FIREBASE_AUTHDOMAIN__': cert.authDomain,
  '__FIREBASE_DATABASEURL__': cert.databaseURL,
  '__FIREBASE_PROJECTID__': cert.projectId,
  '__FIREBASE_STORAGEBUCKET__': cert.storageBucket,
  '__FIREBASE_MESSAGINGSENDERID__': cert.messagingSenderId
}

gulp.task('build:vendor', done => {
  webpack(webpackVendorConfig).run(x => done())
})

gulp.task('client:start', () => {
  const webpackDevConfig = require('./webpack.development.js')
  let compiler = webpack(webpackDevConfig)
  let server = new WebpackDevServer(compiler, webpackDevConfig.devServer)
  let port = webpackDevConfig.devServer.port
  let host = webpackDevConfig.devServer.host

  let fn = err => {
    if(err) throw new gutil.PluginError("webpack-dev-server", err)
    gutil.log("[webpack-dev-server]", "http://" + host + ":" + port)
  }

  server.listen(port, host, fn)
})


gulp.task('client:build', (done) => {
  const webpackProdConfig = require('./webpack.production.js')
  webpack(webpackProdConfig).run(x => done())
})

gulp.task('assets:build', () => {
  gulp.src(__dirname + '/src/client/assets/favicon/*')
    .pipe(gulp.dest(__dirname + '/www/favicon'))

  gulp.src(__dirname + '/src/client/assets/images/*')
    .pipe(gulp.dest(__dirname + '/www/images'))

  gulp.src(__dirname + '/src/client/assets/manifest.json')
    .pipe(gulp.dest(__dirname + '/www/manifest.json'))
})

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

gulp.task('schema:watch', () => {
  let schema = `${__dirname}/src/schema/**/*`
  watch(schema, () => {
    gulp.start('build:schema')
  })
})

let libPath = __dirname + '/src/client/lib'

function getValueErrorFile(path, args, schemaPath) {
  let list = schemaPath.split('/')
  list.shift()
  let name = list[0]
  let category = list[1]
  let field = list[2]
  let parentPath = `/schema/properties/${name}/properties/entity/properties/${category}`
  let propPath = `/schema/properties/${name}/properties/entity/properties/${category}/properties/${field}`

  let content = `
const fieldError = require('${libPath}/fieldError')

module.exports = {
  args: ${JSON.stringify(args)},
  path: '${path}',
  fn: fieldError('${parentPath}', '${propPath}', '${field}')
}
`
  return content
}


function getEntityErrors(path, args, schemaPath) {
  let content = `
const entityErrors = require('${libPath}/entityErrors')

let lastArgs
let lastResult
module.exports = {
  args: ${JSON.stringify(args)},
  path: '${path}',
  fn: x => {
    let currentArgs = JSON.stringify(x)
    if (currentArgs === lastArgs) {
      return lastResult
    } else {
      lastArgs = currentArgs
      lastResult = entityErrors('${schemaPath}')(x)
      return lastResult
    }
  }
}
`
  return content
}

function getParseData(path, arg) {
  let content = `
const parseData = require('${libPath}/parseData')

module.exports = {
  args: {
    data: '${arg}'
  },
  path: '${path}',
  fn: x => parseData(x.data)
}
`
  return content
}

let buildingSchema = false
gulp.task('build:schema', done => {
  buildingSchema = true
  let schema = process.env.SCHEMA_PATH
  Promise.all([
    buildSchema(`${schema}/app.yml`, placeholders).then(x => {
      let file = `${process.env.CLIENT_PATH}/data/schema.yml`
      ensureDirectoryExistence(file)
      fs.writeFileSync(file, yaml.safeDump(x), 'utf-8')
      fs.writeFileSync(__dirname + '/src/client/data/schema.json', JSON.stringify(x), 'utf-8')

      let initial = defaults(x)
      let models = buildValidation(x, initial)
      let modelsFolder = __dirname + '/src/client/models/generated'
      fs.writeFileSync(__dirname + '/src/client/data/initial.yml', yaml.safeDump(initial), 'utf-8')
      fs.writeFileSync(__dirname + '/src/client/data/initial.json', JSON.stringify(initial), 'utf-8')

      rimraf(modelsFolder, () => {
        Object.keys(models).forEach(x => {
          let file = modelsFolder + '/' + x.replace('./models/', '')

          let parts = file.split('/')
          parts.pop()
          let folder = parts.join('/')
          mkdirp.sync(folder)
          let model = models[x]
          model.args.schema = '/schema'

          let schemaPath = model.args.data
            .replace('/action/data', '')
            .replace(/\/value$/, '')

          if (/action\/error$/.test(file)) {
            model.args.data = model.args.data.replace('/data', '/parsedData')
            let content = getEntityErrors(model.path, model.args, schemaPath)
            fs.writeFileSync(file + '.js', content, 'utf-8')

            let parsedFile = file.replace('/error', '/parsedData')
            let parsedContent = getParseData(model.path.replace('/errors', '/parsedData'), model.path.replace('/errors', '/data'))
            fs.writeFileSync(parsedFile + '.js', parsedContent, 'utf-8')
          } else {
            let content = getValueErrorFile(model.path, model.args, schemaPath)
            fs.writeFileSync(file + '.js', content, 'utf-8')
          }

        })
        
      })

    }),
    buildSchema(`${schema}/db.yml`, placeholders).then(x => {
      let file = `${process.env.SERVER_PATH}/schema.yml`
      ensureDirectoryExistence(file)
      fs.writeFileSync(file, yaml.safeDump(x), 'utf-8')
    })
  ]).then(x => {
    done()
    buildingSchema = false
  })
})

function getName(file) {
  let path = file.match(/([a-zA-Z0-9_]+)/gi)
  path.pop()
  path.shift()
  let name = path.join('-')
  return name
}

let buildingEntry = false

gulp.task('entry:watch', () => {
  let paths = ['views', 'controllers', 'models']
  paths.forEach(x => {
    watch(__dirname + `/src/client/${x}/**/*`, {
      events: ['add', 'unlink']
    }, x => {
      if (!buildingEntry) {
        gulp.start('build:entry')
      }
    })
  })
})

gulp.task('build:entry', () => {
  let root = __dirname + '/src/client'
  buildingEntry = true

  return new Promise((resolve, reject) => {

    buildEntry(resolve)
  })

  function buildEntry(done) {

    if (buildingSchema) {
      console.log('[build:entry] Waiting for build:schema to finish.')
      setTimeout(() => buildEntry(done), 100)
      return
    }

    recursive(root, function (err, files) {
      if (!files) {
        console.log('[build:entry] Waiting for files to be available.')
        setTimeout(() => buildEntry(done), 100)
        return
      }

      files = files
        .map(x => x.replace(root, ''))
        .filter(x => /^\/(views|controllers|models)/g.test(x) && !/(yml|yaml)$/g.test(x))
        .map(x => '.' + x)

      let vars = ''
      let hmr = ''
      files.forEach(x => {
        hmr += `
        module.hot.accept('${x}', () => {
          hotReload('${x}')
        })
        `
      })

      let controllers = ''
      files.forEach(x => {
        if (/^\.\/controllers/g.test(x)) {
          let name = getName(x)
          let varName = `controllers${name.replace(/\-/g, '_')}`

          vars += `let ${varName} = require('${x}')\n`
          controllers += `{
        name: '${name}',
        args: ${varName}.args,
        fn: ${varName}.fn
      },\n`
        }
      })

      let views = ''
      files.forEach(x => {
        if (/^\.\/views/g.test(x)) {
          let name = getName(x)
          let varName = `views${name.replace(/\-/g, '_')}`
          vars += `let ${varName} = require('${x}')\n`
          views += `{
        name: '${name}',
        args: ${varName}.args ? ${varName}.args : {},
        template: ${varName}.template,
        props: ${varName}.props ? ${varName}.props : []
      },\n`
        }
      })

      let models = ''
      files.forEach(x => {
        if (/^\.\/models/g.test(x)) {
          let name = getName(x)
          let varName = `models${name.replace(/\-/g, '_')}`
          let req = require(root + x.replace(/^\./, ''))
          let pathMod
          if (req.path) {
            pathMod = `${varName}.path`
          } else {
            pathMod = `'/${name.replace(/\-/g, '/')}'`
          }

          vars += `let ${varName} = require('${x}')\n`
          models += `{
        name: '${name}',
        args: ${varName}.args,
        fn: ${varName}.fn,
        path: ${pathMod}
      },\n`
        }
      })

      vars += `let dataObj = require('./data/initial.json')
      dataObj.name = 'initial'\n
      dataObj.config.responsive = process.env.RESPONSIVE

      let schemaObj = require('./data/schema.json')
      dataObj.schema = schemaObj
  `
      let data = `
      data: dataObj,
      `

      let mod = `function getModule() {
    ${vars}
    let mod = {
      name: 'app',
      data: dataObj,
      views: [${views}],
      models: [${models}],
      controllers: [${controllers}]
    }
    return mod
  }
  `
      let app = fs.readFileSync(root + `/app.template.${process.env.NODE_ENV}.js`, 'utf-8')
      app = app.replace('__GET_MODULE_FUNCTION_IMPORT__', mod)
      app = app.replace('__MODULE_HOT_ACCEPT__', hmr)
      fs.writeFileSync(root + '/app.js', app, 'utf-8')

      buildingEntry = false
      done()
    });
  }
})

gulp.task('clean', () => del([`${process.env.DIST_PATH}/*`]))

gulp.task('build:app', sync(['clean', 'build:vendor', 'build:schema', 'build:entry', 'assets:build', 'client:build']))
gulp.task('start:app', sync(['build:vendor', 'build:schema', 'build:entry', 'client:start', ['entry:watch', 'schema:watch']]))
gulp.task('start:test', ['tests:unit', 'tests:perf'])
