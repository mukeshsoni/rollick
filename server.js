#!/usr/bin/env node

var babel = require('babel-core')
var fs = require('fs')
var http = require('http')
var path = require('path')
var parseArgs = require('minimist')

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

// for allowing wirdcards like '*.less' to test for all files with .less extension
function wildCardMatcher(rule, text) {
    const regex = new RegExp(rule.split('*').map(a => a.replace('.', '\\.'))).join('.*')

    return regex.test(text)
}

function last(arr) {
    return arr[arr.length - 1]
}

function fileExtension(fileName) {
    return last(fileName.split('.'))
}

function hasPaths(config) {
    return config.server.paths && Object.keys(config.server.paths).length > 0
}

function adjustPaths(config, filePath) {
    if(hasPaths(config)) {
        return Object.keys(config.server.paths).reduce((acc, inUrl) => {
            if(acc.indexOf(inUrl) >= 0) {
                return acc.replace(inUrl, config.paths[inUrl])
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
    if(hasLoaders(toolConfig)) {
        return toolConfig.server.loaders.filter(loader => loader.test.test(filePath))
            .reduce((acc, loader) => {
                if(loader.loader === 'babel') {
                    var transformed = babel.transformFileSync(filePath, babelOptions)
                    return transformed.code
                } else {
                    return loader.loader(acc)
                }
            }, fileContent)
    } else {
        return fileContent
    }
}

// send the correct contentType header
http
    .createServer(function(req, response) {
        var filePath = req.url.slice(1).split('?')[0]
        filePath = adjustPaths(toolConfig, filePath)

        // console.log('filePath', filePath)
        if (fs.existsSync(filePath)) {
            response.writeHead(200)
            response.end(applyLoaders(toolConfig, filePath, fs.readFileSync(filePath, 'utf8')), 'utf8')
        } else {
            console.log('file does not exist', filePath, req.url)
            response.writeHead(500)
            response.end('file does not exist')
            response.end()
        }
    })
    .listen(port)

process.on('uncaughtException', function(err) {
    console.error('Uncaught exception', err)
})

console.log(
    `${toolName} available at http://localhost:${port}/.${toolName}/index.html`
)
