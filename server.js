#!/usr/bin/env node

var babel = require('babel-core')
var fs = require('fs')
var http = require('http')
var path = require('path')
var parseArgs = require('minimist')
var exec = require('child_process').exec

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

// send the correct contentType header
var request = http
    .createServer(function(req, response) {
        var filePath = req.url.slice(1).split('?')[0]
        filePath = adjustPaths(toolConfig, filePath)

        // defaultExtension option does not work for relative paths (e.g. './x') in systemjs
        // there are many node_modules libraries which require stuff without file extension
        // we will add the js extension by default, if none exists
        if (!fileExtension(filePath)) {
            filePath = filePath + '.js'
        }

        // console.log('filePath', filePath)
        if (fs.existsSync(filePath)) {
            response.writeHead(200)
            // font files should not be loaded with 'utf8' encoding. They are binary files. Loading them with 'utf8' encoding and sending them across to browser breaks/corrupts them.
            // send buffered content to loaders. Let them convert to 'utf8' string manually (using .toString('utf'))
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
            setTimeout(() => {
                exec(`open ${url}`)
            }, 1000)
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
