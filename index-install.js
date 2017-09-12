// The plan
// Create folder named .rollick in the directory it's invoked from
// Copy these files in .rollick directory
// - index.html
// - meta_data_generator.js
// - jspm.config.js
// - package.json
// - main.js
// - src folder
// cd to .rollick
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

const toolName = 'rollick'
var toolFolder = path.resolve(process.cwd() + '/.' + toolName)
var toolConfig = require(path.resolve(process.cwd()) +
    '/' +
    toolName +
    '.config.js')

// create .rollick folder if it doesn't exist
function createtoolFolder() {
    if (!fs.existsSync(toolFolder)) {
        return fs.mkdirSync(toolFolder)
    } else {
        return Promise.resolve({})
    }
}

// remove any existing stuff from .rollick, if any
function emptytoolFolder() {
    return fs.remove(toolFolder + '/*')
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
        'server.js',
        'sw_rollick.js',
        'src'
    ]

    return Promise.all(
        filesToCopy.map(file => {
            return fs.copy(__dirname + '/' + file, toolFolder + '/' + file)
        })
    )
}

function gototoolFolder() {
    // process.chdir is synchronous. We need async for our purpose
    return new Promise(resolve => {
        process.chdir(toolFolder)
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
    return promisifiedExec('npm run docgen -- --config=../rollick.config.js')
}

function addGlobals(toolConfig) {
    function createCssLinks(cssConfig) {
        function wrapUrlInLinkTag(url) {
            return `<link href="${url}" rel="stylesheet" />`
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

    if (toolConfig && toolConfig.globals) {
        if (toolConfig.globals.css) {
            let indexFile = fs.readFileSync(__dirname + '/index.html', 'utf-8')

            indexFile = indexFile.replace(
                '</head>',
                `${createCssLinks(toolConfig.globals.css)}\n</head>`
            )

            return fs.writeFile(toolFolder + '/index.html', indexFile)
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

function updatePaths(toolConfig, jspmConfig) {
    if (toolConfig.jspm && toolConfig.jspm.paths) {
        const newPaths = Object.keys(
            toolConfig.jspm.paths
        ).reduce((acc, key) => {
            return acc + `\n'${key}': '${toolConfig.jspm.paths[key]}',`
        }, '')
        return jspmConfig.replace(
            "'rollick/': 'src/'",
            "'rollick/': 'src/'," + newPaths
        )
    } else {
        return jspmConfig
    }
}

function updatePackagesProperty(toolConfig, jspmConfig) {
    if (toolConfig.jspm && toolConfig.jspm.paths) {
        const packagesConfig = {
            [Object.keys(toolConfig.jspm.paths)[0]]: {
                main: 'pp_rollick.js',
                meta: {
                    '*.js': {
                        format: 'cjs',
                        loader: 'plugin-babel',
                        babelOptions: {
                            // optional: ['runtime'],
                            modularRuntime: false,
                            stage1: true,
                            plugins: [
                                'babel-plugin-transform-react-remove-prop-types',
                                'babel-plugin-transform-flow-strip-types',
                                'babel-plugin-transform-react-jsx'
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

    jspmConfig = updatePackagesProperty(toolConfig, jspmConfig)
    jspmConfig = updatePaths(toolConfig, jspmConfig)

    return fs.writeFile(jspmConfigFilePath, jspmConfig)
}

pifyLog('Creating .rollick  folder')
    .then(createtoolFolder)
    .then(pifyLog.bind(null, 'Emptying .rollick folder'))
    .then(emptytoolFolder)
    .then(pifyLog.bind(null, 'copying needed files'))
    .then(copyNeededFiles)
    .then(pifyLog.bind(null, 'going inside .rollick folder'))
    .then(gototoolFolder)
    .then(pifyLog.bind(null, 'modifying jspm config file'))
    .then(updateJspmConfigFile)
    .then(pifyLog.bind(null, 'adding global links to index.html file'))
    .then(addGlobals.bind(null, toolConfig))
    .then(pifyLog.bind(null, 'installing npm modules'))
    .then(installNpmModules)
    .then(pifyLog.bind(null, 'installing jspm modules'))
    .then(installJspmModules)
    .then(pifyLog.bind(null, 'generating meta file for components'))
    .then(generateMetaFile)
    .catch(e => console.error('Error creating rollick stuff', e))
