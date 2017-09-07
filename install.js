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

var reactpenFolder = path.resolve(process.cwd() + '/.reactpen')
var reactpenConfig = require(path.resolve(process.cwd()) +
    '/reactpen.config.js')

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
        'sw_reactpen.js',
        'src'
    ]

    return Promise.all(
        filesToCopy.map(file => {
            return fs.copy(__dirname + '/' + file, reactpenFolder + '/' + file)
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
    return promisifiedExec('npm run docgen -- --config=../reactpen.config.js')
}

function addGlobals(reactpenConfig) {
    function createCssLinks(cssConfig) {
        function wrapUrlInLinkTag(url) {
            return `<link src="${url}" rel="stylesheet" />`
        }

        if (Array.isArray(cssConfig.urls)) {
            return cssConfig.urls.reduce(
                (acc, url) => `${acc}\n${wrapUrlInLinkTag(url)}`,
                ''
            )
        } else {
            return wrapUrlInLinkTag(cssConfig.urls)
        }
    }

    if (reactpenConfig && reactpenConfig.globals) {
        if (reactpenConfig.globals.css) {
            let indexFile = fs.readFileSync(__dirname + '/index.html', 'utf-8')

            indexFile = indexFile.replace(
                '</head>',
                `${createCssLinks(reactpenConfig.globals.css)}\n</head>`
            )

            return fs.writeFile(reactpenFolder + '/index.html', indexFile)
        } else {
            return Promise.resolve({})
        }
    } else {
        return Promise.resolve({})
    }
}

function pifyLog(msg) {
    console.log(msg)
    return Promise.resolve({})
}

function updatePaths(reactpenConfig, jspmConfig) {
    if (reactpenConfig.jspm && reactpenConfig.jspm.paths) {
        const newPaths = Object.keys(
            reactpenConfig.jspm.paths
        ).reduce((acc, key) => {
            return acc + `\n'${key}': '${reactpenConfig.jspm.paths[key]}',`
        }, '')
        return jspmConfig.replace(
            "'reactpen/': 'src/'",
            "'reactpen/': 'src/'," + newPaths
        )
    } else {
        return jspmConfig
    }
}

function updatePackagesProperty(reactpenConfig, jspmConfig) {
    if (reactpenConfig.jspm && reactpenConfig.jspm.paths) {
        const packagesConfig = {
            [Object.keys(reactpenConfig.jspm.paths)[0]]: {
                main: 'pp_reactpen.js',
                meta: {
                    '*.js': {
                        loader: 'plugin-babel',
                        babelOptions: {
                            optional: ['runtime'],
                            stage1: true,
                            plugins: [
                                'babel-plugin-transform-react-jsx',
                                'babel-plugin-transform-flow-strip-types'
                            ]
                        }
                    },
                    '*.css': {
                        loader: 'css'
                    },
                    '*.less': {
                        loader: 'less'
                    }
                }
            }
        }

        jspmConfig = jspmConfig.replace(
            'packages: ',
            'packages: ' + JSON.stringify(packagesConfig, null, 4)
        )
        return jspmConfig.replace('}\n}{', '},\n')
    } else {
        return jspmConfig
    }
}

function updateJspmConfigFile() {
    const jspmConfigFilePath = process.cwd() + '/jspm.config.js'

    let jspmConfig = fs.readFileSync(jspmConfigFilePath, 'utf-8')
    // change base url
    // somethings the quotes on baseURL are not there. Depends on what jspm generates or how a pretty printer decides to format it. Leads to all sorts of bugs in the next line. line not even finding that string and so no replacement
    // chaning to '.' is required since otherwise we would serve wrong stuff for many
    // jspmConfig = jspmConfig.replace("'baseURL': '/", "baseURL: '.")

    jspmConfig = updatePackagesProperty(reactpenConfig, jspmConfig)
    jspmConfig = updatePaths(reactpenConfig, jspmConfig)

    return fs.writeFile(jspmConfigFilePath, jspmConfig)
}

pifyLog('Creating .reactpen  folder')
    .then(createReactpenFolder)
    .then(pifyLog.bind(null, 'Emptying .reactpen folder'))
    .then(emptyReactpenFolder)
    .then(pifyLog.bind(null, 'copying needed files'))
    .then(copyNeededFiles)
    .then(pifyLog.bind(null, 'going inside .reactpen folder'))
    .then(gotoReactpenFolder)
    .then(pifyLog.bind(null, 'modifying jspm config file'))
    .then(updateJspmConfigFile)
    .then(pifyLog.bind(null, 'adding global links to index.html file'))
    .then(addGlobals.bind(null, reactpenConfig))
    .then(pifyLog.bind(null, 'installing npm modules'))
    .then(installNpmModules)
    .then(pifyLog.bind(null, 'installing jspm modules'))
    .then(installJspmModules)
    .then(pifyLog.bind(null, 'generating meta file for components'))
    .then(generateMetaFile)
    .catch(e => console.error('Error creating reactpen stuff', e))
