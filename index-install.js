#!/usr/bin/env node
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

var fs = require("fs-extra")
var path = require("path")
var childProcess = require("child_process")
var { exec } = childProcess
var pify = require("pify")
// TODO - remove ncp
var ncp = require("ncp").ncp
var belt = require("./belt.js")
var { zipWith } = belt
var recursivelyCopy = pify(ncp)
var promisifiedExec = pify(exec)
// var promisifiedSpawn = pify(spawn)
var ora = require("ora")
var spinner

const toolName = "rollick"
var toolFolder = path.resolve(process.cwd() + "/." + toolName)
var toolConfig = require(path.resolve(process.cwd()) +
    "/" +
    toolName +
    ".config.js")

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
    return fs.remove(toolFolder + "/*")
}

function copyNeededFiles() {
    // copy stuff we need
    const filesToCopy = [
        // 'app-bundle.js',
        "index.html",
        "index-dev.html",
        "meta_data_generator.js",
        "belt.js",
        "jspm.config.js",
        "package.json",
        "main.js",
        "server.js",
        "sw_rollick.js",
        "src"
    ]

    return Promise.all(
        filesToCopy.map(file => {
            return fs.copy(__dirname + "/" + file, toolFolder + "/" + file)
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
    return promisifiedExec("npm install", { cwd: toolFolder })
}

function installJspmModules() {
    return promisifiedExec("npm run jspm", { cwd: toolFolder })
}

function installHostNpmModules() {
    if (
        toolConfig.jspm &&
        toolConfig.jspm.install &&
        toolConfig.jspm.install.npm &&
        toolConfig.jspm.install.npm.packages
    ) {
        // packages is an array so that users can specify an order of installation
        const packages = toolConfig.jspm.install.npm.packages
        // TODO - object.keys stuff should be replaced with zipWith. Or try Object.entries (if it's supported in node)
        // Thought of running the jspm install commands concurrently at first. Then decided it might lead to some order problems in jspm.config.js
        return packages.reduce((acc, package) => {
            const withVersion = `${package.name}@${package.version}`
            return acc
                .then(() =>
                    pifyLog("Installing npm:" + withVersion + " using jspm")
                )
                .then(() =>
                    promisifiedExec(
                        "./node_modules/.bin/jspm install --yes --log warn npm:" +
                            withVersion,
                        { cwd: toolFolder }
                    )
                )
                .catch(e =>
                    console.error(
                        "error install host npm package ",
                        withVersion,
                        e
                    )
                )
        }, Promise.resolve({}))
    } else {
        return Promise.resolve({})
    }
}

function generateMetaFile() {
    return promisifiedExec("npm run docgen -- --config=../rollick.config.js", {
        cwd: toolFolder
    })
}

// function addOnLoadFunctions(toolConfig) {
//     if (toolConfig && toolConfig.onLoad) {
//         let indexFile = fs.readFileSync(__dirname + '/index.html', 'utf-8')
//         let devIndexFile = fs.readFileSync(
//             __dirname + '/index-dev.html',
//             'utf-8'
//         )

//         indexFile = indexFile.replace(
//             "SystemJS.import('main.js')",
//             `${createCssLinks(toolConfig.globals.css)}\n</head>`
//         )

//         devIndexFile = devIndexFile.replace(
//             '</head>',
//             `${createCssLinks(toolConfig.globals.css)}\n</head>`
//         )

//         return Promise.all([
//             fs.writeFile(toolFolder + '/index.html', indexFile),
//             fs.writeFile(toolFolder + '/index-dev.html', devIndexFile)
//         ])
//     } else {
//         return Promise.resolve({})
//     }
// }

function addGlobals(toolConfig) {
    function createCssLinks(cssConfig) {
        function wrapUrlInLinkTag(url) {
            return `<link href="${url}" rel="stylesheet" />`
        }

        if (Array.isArray(cssConfig.urls)) {
            return cssConfig.urls.reduce(
                (acc, url) => `${acc}\n${wrapUrlInLinkTag(url)}`,
                ""
            )
        } else {
            return wrapUrlInLinkTag(cssConfig.urls)
        }
    }

    if (toolConfig && toolConfig.globals) {
        if (toolConfig.globals.css) {
            let indexFile = fs.readFileSync(__dirname + "/index.html", "utf-8")
            let devIndexFile = fs.readFileSync(
                __dirname + "/index-dev.html",
                "utf-8"
            )

            indexFile = indexFile.replace(
                "</head>",
                `${createCssLinks(toolConfig.globals.css)}\n</head>`
            )

            devIndexFile = devIndexFile.replace(
                "</head>",
                `${createCssLinks(toolConfig.globals.css)}\n</head>`
            )

            return Promise.all([
                fs.writeFile(toolFolder + "/index.html", indexFile),
                fs.writeFile(toolFolder + "/index-dev.html", devIndexFile)
            ])
        } else {
            return Promise.resolve({})
        }
    } else {
        return Promise.resolve({})
    }
}

function pifyLogStart(msg) {
    spinner = ora(msg)
    return Promise.resolve(spinner)
}

function pifyLogStop() {
    spinner.succeed()
    return Promise.resolve(spinner.stop())
}

function pifyFailAndStop(error) {
    return Promise.resolve(spinner.fail(error))
}

function pifyLog(msg) {
    spinner.succeed()
    return Promise.resolve(spinner.start(msg))
}

function updatePaths(toolConfig, jspmConfig) {
    if (toolConfig.jspm && toolConfig.jspm.paths) {
        const newPaths = Object.keys(
            toolConfig.jspm.paths
        ).reduce((acc, key) => {
            return acc + `\n'${key}': '${toolConfig.jspm.paths[key]}',`
        }, "")
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
                main: "pp_rollick.js",
                meta: {
                    "*.js": {
                        format: "cjs",
                        loader: "plugin-babel",
                        babelOptions: {
                            // optional: ['runtime'],
                            modularRuntime: false,
                            stage1: true,
                            plugins: [
                                "babel-plugin-transform-react-remove-prop-types",
                                "babel-plugin-transform-flow-strip-types",
                                "babel-plugin-transform-react-jsx"
                            ]
                        }
                    },
                    "*.css": {
                        loader: "css"
                    },
                    "*.less": {
                        loader: "less"
                    },
                    "*.sass": {
                        loader: "sass"
                    },
                    "*.scss": {
                        loader: "sass"
                    },
                    "*.json": {
                        loader: "json"
                    }
                }
            }
        }

        jspmConfig = jspmConfig.replace(
            "packages: ",
            "packages: " + JSON.stringify(packagesConfig, null, 4)
        )
        return jspmConfig.replace("}\n}{", "},\n")
    } else {
        return jspmConfig
    }
}

function updateJspmConfigFile() {
    const jspmConfigFilePath = process.cwd() + "/jspm.config.js"

    let jspmConfig = fs.readFileSync(jspmConfigFilePath, "utf-8")
    // change base url
    // somethings the quotes on baseURL are not there. Depends on what jspm generates or how a pretty printer decides to format it. Leads to all sorts of bugs in the next line. line not even finding that string and so no replacement
    // chaning to '.' is required since otherwise we would serve wrong stuff for many
    // jspmConfig = jspmConfig.replace("'baseURL': '/", "baseURL: '.")

    jspmConfig = updatePackagesProperty(toolConfig, jspmConfig)
    jspmConfig = updatePaths(toolConfig, jspmConfig)

    return fs.writeFile(jspmConfigFilePath, jspmConfig)
}

pifyLogStart("Creating .rollick  folder")
    .then(createtoolFolder)
    .then(pifyLog.bind(null, "Emptying .rollick folder"))
    .then(emptytoolFolder)
    .then(pifyLog.bind(null, "copying needed files"))
    .then(copyNeededFiles)
    .then(pifyLog.bind(null, "going inside .rollick folder"))
    .then(gototoolFolder)
    .then(pifyLog.bind(null, "modifying jspm config file"))
    .then(updateJspmConfigFile)
    .then(pifyLog.bind(null, "adding global links to index.html file"))
    .then(addGlobals.bind(null, toolConfig))
    // .then(pifyLog.bind(null, 'adding onLoad functions if any provided to index.html file'))
    // .then(addOnLoadFunctions.bind(null, toolConfig))
    .then(pifyLog.bind(null, "installing npm modules"))
    .then(installNpmModules)
    .then(pifyLog.bind(null, "installing jspm modules"))
    .then(installJspmModules)
    .then(
        pifyLog.bind(null, "Installing npm modules for host project using jspm")
    )
    .then(installHostNpmModules)
    .then(pifyLog.bind(null, "generating meta file for components"))
    .then(updateJspmConfigFile)
    .then(pifyLog.bind(null, "adding global links to index.html file"))
    .then(generateMetaFile)
    .then(
        pifyLog.bind(
            null,
            'Please run "rollick start" on your terminal to start server'
        )
    )
    .then(pifyLogStop)
    .catch(e => {
        pifyFailAndStop().then(() =>
            console.error("Error doing rollick stuff", e)
        )
    })
