// The plan
// Create folder named .reactpen in the directory it's invoked from
// Copy these files in .reactpen directory
// - index.html
// - meta_data_generator.js
// - jspm.config.js
// - package.json
// - main.js
// - src folder
// cd to .reactpen
// run `npm install`
// run `npm run build`
// start server in project root

var fs = require('fs-extra')
var path = require('path')
var exec = require('child_process').exec
var pify = require('pify')
// TODO - remove ncp
var ncp = require('ncp').ncp
var recursivelyCopy = pify(ncp)
var promisifiedExec = pify(exec)

var reactpenFolder = './.reactpen'

// create .reactpen folder if it doesn't exist
function createReactpenFolder() {
    if (!fs.existsSync(reactpenFolder)) {
        return fs.mkdirSync(reactpenFolder)
    } else {
        return Promise.resolve({})
    }
}

// remove any existing stuff from .reactpen, if any
function emptyReactpenFolder() {
    return fs.remove(reactpenFolder + '/*')
}

function copyNeededFiles() {
    // copy stuff we need
    const filesToCopy = [
        'index.html',
        'meta_data_generator.js',
        'belt.js',
        'jspm.config.js',
        'package.json',
        'main.js',
        'src'
    ]

    return Promise.all(
        filesToCopy.map(file => {
            return fs.copy(file, reactpenFolder + '/' + file)
        })
    )
}

function gotoReactpenFolder() {
    // process.chdir is synchronous. We need async for our purpose
    return new Promise(resolve => {
        process.chdir(reactpenFolder)
        resolve()
    })
}

function installNpmModules() {
    return promisifiedExec('npm install')
}

function installJspmModules() {
    return promisifiedExec('npm run jspm')
}

function generateMetaFile() {
    return promisifiedExec('npm run docgen')
}

function pifyLog(msg) {
    console.log(msg)
    return Promise.resolve({})
}

pifyLog('Creating .reactpen  folder')
    .then(createReactpenFolder)
    .then(pifyLog.bind(null, 'Emptying .reactpen folder'))
    .then(emptyReactpenFolder)
    .then(pifyLog.bind(null, 'copying needed files'))
    .then(copyNeededFiles)
    .then(pifyLog.bind(null, 'going inside .reactpen folder'))
    .then(gotoReactpenFolder)
    .then(pifyLog.bind(null, 'installing npm modules'))
    .then(installNpmModules)
    .then(pifyLog.bind(null, 'installing jspm modules'))
    .then(installJspmModules)
    .then(pifyLog.bind(null, 'generating meta file for components'))
    .then(generateMetaFile)
    .catch(e => console.log('Error creating reactpen stuff', e))
