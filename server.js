#!/usr/bin/env node

var babel = require('babel-core')
var io = require('socket.io')()
var jspm = require('jspm')
var fs = require('fs')
var http = require('http')
var path = require('path')
var parseArgs = require('minimist')
var exec = require('child_process').exec
var resolveFile = require('resolve-file')
var mime = require('mime-types')

var args = parseArgs(process.argv.slice(1))
const port = args.port || 4000

const toolName = 'rollick'
const toolConfig = require(process.cwd() + '/' + toolName + '.config.js')

// TODO - should be pulled out to config babel options. Few defaults can be here
var babelOptions = {
    presets: ['react', 'es2015', 'stage-2'],
    plugins: [
        'dev-expression',
        'transform-react-jsx-source',
        'transform-react-jsx-self',
        [
            'transform-react-jsx-location',
            {
                filename: 'compact'
            }
        ],
        'transform-regenerator',
        'add-module-exports',
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-flow-strip-types',
        'transform-object-assign'
    ]
}

function last(arr) {
    return arr[arr.length - 1]
}

function fileExtension(fileName) {
    if (fileName.split('.').length > 1) {
        return last(fileName.split('.'))
    } else {
        return ''
    }
}

// for allowing wirdcards like '*.less' to test for all files with .less extension
function wildCardMatcher(rule, text) {
    const regex = new RegExp(
        rule.split('*').map(a => a.replace('.', '\\.'))
    ).join('.*')

    return regex.test(text)
}

function hasPaths(config) {
    return config.server.paths && Object.keys(config.server.paths).length > 0
}

function adjustPaths(config, filePath) {
    if (hasPaths(config)) {
        return Object.keys(config.server.paths).reduce((acc, inUrl) => {
            if (acc.indexOf(inUrl) >= 0) {
                return acc.replace(inUrl, config.server.paths[inUrl])
            } else {
                return acc
            }
        }, filePath)
    } else {
        return filePath
    }
}

function hasLoaders(config) {
    return config.server.loaders && config.server.loaders.length > 0
}

function applyLoaders(toolConfig, filePath, fileContent) {
    if (hasLoaders(toolConfig)) {
        return toolConfig.server.loaders
            .filter(loader => loader.test.test(filePath))
            .reduce((acc, loader) => {
                if (loader.loader === 'babel') {
                    var transformed = babel.transformFileSync(
                        filePath,
                        babelOptions
                    )
                    return transformed.code
                } else {
                    return loader.loader(acc.toString('utf8'))
                }
            }, fileContent)
    } else {
        return fileContent
    }
}

function tryResolvingFilePath(filePath, req) {
    // does not work for cases where someone does `require('path/to/module')` but wants `path/to/module/index.js`
    // if(fs.lstatSync(filePath) && fs.lstatSync(filePath).isFile()) {
    // // if (fs.existsSync(filePath)) {
    //     return filePath
    // }

    // give it to resolveFile to try and resolve it as such
    if (resolveFile(filePath)) {
        if (
            fs.lstatSync(resolveFile(filePath)) &&
            fs.lstatSync(resolveFile(filePath)).isDirectory()
        ) {
            console.log('file is a directory. trying to resolve', filePath)
            if (
                fs.lstatSync(resolveFile(filePath) + '/index.js') &&
                fs.lstatSync(resolveFile(filePath) + '/index.js').isFile()
            ) {
                return resolveFile(filePath) + '/index.js'
            } else {
                console.log(
                    'file path is a directory path',
                    filePath,
                    resolveFile(filePath)
                )
                return resolveFile(filePath)
            }
        } else {
            return resolveFile(filePath)
        }
    } else if (filePath.startsWith('.rollick')) {
        // let's try stripping off .rollick from the url and try resolving what remains
        const withoutDotRollick = filePath.replace('.rollick/', '')
        if (resolveFile(withoutDotRollick)) {
            return resolveFile(withoutDotRollick)
        } else {
            console.log(
                'could not resolve even without rollick',
                req.url,
                withoutDotRollick
            )
            return filePath
        }
    } else if (!fileExtension(filePath)) {
        // defaultExtension option does not work for relative paths (e.g. './x') in systemjs
        // there are many node_modules libraries which require stuff without file extension
        // we will add the js extension by default, if none exists
        if (resolveFile(filePath + '.js')) {
            return filePath + '.js'
        }
    }

    // failed all attemps. return the original one.
    // just returning the original one does not make sense
    // should return some error
    // or use Maybe or Either
    return filePath
}

function getPackageVersion(packageName) {
    var packageJson = JSON.parse(fs.readFileSync('package.json'))

    if (packageJson && packageJson.jspm && packageJson.jspm.dependencies) {
        var packageNameFull = packageJson.jspm.dependencies[packageName]
        var versionInfo = last(packageNameFull.split('@'))
        if (/\d/.test(versionInfo[0])) {
            console.log('version for package', packageName, versionInfo)
            return versionInfo
        } else {
            console.log(
                'version for package',
                packageName,
                versionInfo.slice(1)
            )
            return /\d/.test(versionInfo.slice(1)[0])
                ? versionInfo.slice(1)
                : ''
        }
    } else {
        return ''
    }
}
// send the correct contentType header
var request = http
    .createServer(function(req, response) {
        if (req.method === 'POST') {
            if (req.url === '/install') {
                console.log('Got post request', req.url)
                var body = ''
                req.on('data', function(data) {
                    body += data
                })
                req.on('end', function() {
                    try {
                        const postBody = JSON.parse(body)
                        if (!postBody || !postBody.packageName) {
                            return
                        }
                        jspm
                            .install({
                                [postBody.packageName]:
                                    'npm:' + postBody.packageName
                            })
                            .then(packageInfo => {
                                console.log(
                                    'Installation done for package',
                                    postBody.packageName,
                                    packageInfo,
                                    getPackageVersion(postBody.packageName)
                                )

                                socketIOClient.emit('installation', {
                                    done: true,
                                    packageName: postBody.packageName,
                                    version: getPackageVersion(
                                        postBody.packageName
                                    )
                                })
                            })
                            .catch(e => {
                                console.error(
                                    'Installation failed for package',
                                    postBody.packageName,
                                    e.toString()
                                )
                                socketIOClient.emit('installation', {
                                    done: false,
                                    error: e.toString(),
                                    packageName: postBody.packageName
                                })
                            })
                    } catch (e) {
                        console.error(
                            'Error parsing post body for /install',
                            e.toString()
                        )
                    }
                })
                return
            } else {
                return
            }
        }

        var filePath = req.url.slice(1).split('?')[0]
        filePath = tryResolvingFilePath(adjustPaths(toolConfig, filePath), req)

        // console.log('filePath', filePath)
        if (fs.existsSync(filePath)) {
            if (
                filePath.includes('jspm_packages') ||
                filePath.includes('node_modules')
            ) {
                response.setHeader('Cache-Control', 'public, max-age=31557600')
            }

            response.writeHead(200, { 'Content-Type': mime.lookup(filePath) })
            // font files should not be loaded with 'utf8' encoding. They are binary files. Loading them with 'utf8' encoding and sending them across to browser breaks/corrupts them.
            // send buffered content to loaders. Let them convert to 'utf8' string manually (using .toString('utf'))
            // console.log('filePath to read', filePath)
            response.end(
                applyLoaders(toolConfig, filePath, fs.readFileSync(filePath))
            )
        } else {
            console.log('file does not exist', filePath, req.url)
            response.writeHead(500)
            response.end('file does not exist')
            response.end()
        }
    })
    .listen(port, function(err) {
        if (err) {
            console.error('Error starting server', err)
            exit()
        } else {
            const url = `http://localhost:${port}/.${toolName}/index.html`
            console.log(
                `${toolName} available at http://localhost:${port}/.${toolName}/index.html`
            )
        }
    })

request.on('error', function(err) {
    switch (err.code) {
        case 'EADDRINUSE':
            console.error(
                'The port ',
                err.port,
                ' seems to be used by some other server. Please try another port using the --port option'
            )
            break
        default:
            console.error('Error in server', err.toString())
    }
})

process.on('uncaughtException', function(err) {
    console.error('Uncaught exception', err)
})

var socketIOClient
io.on('connection', function(client) {
    client.on('subscribeToInstalls', function() {
        socketIOClient = client
        console.log('client subscribed to install events')
    })
})

var socketIOPort = 8008
io.listen(socketIOPort)
