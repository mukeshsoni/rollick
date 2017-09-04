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
var ncp = require('ncp').ncp
var recursivelyCopy = pify(ncp)

var reactpenFolder = './.reactpen'

// create .reactpen folder if it doesn't exist
if (!fs.existsSync(reactpenFolder)) {
    fs.mkdirSync(reactpenFolder)
}

// remove any existing stuff from .reactpen, if any
fs.remove(reactpenFolder + '/*').catch(console.error)

// copy stuff we need
const filesToCopy = [
    'index.html',
    'meta_data_generator.js',
    'jspm.config.js',
    'package.json',
    'main.js',
    'src/*'
]

filesToCopy.forEach(file => {
    fs.copy(file, reactpenFolder + '/' + file)
})

// cd .reactpen
process.chdir(reactpenFolder)
fs
    .readdir(reactpenFolder)
    .then(files => files.forEach(console.log))
    .catch(console.error)
// npm install

var promisifiedExec = pify(exec)
promisifiedExec('npm i').then(() => promisifiedExec('npm run build'))
