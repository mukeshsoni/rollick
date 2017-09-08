var babel = require('babel-core')
var fs = require('fs')
var http = require('http')
var path = require('path')

var opts = {
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

function shouldBeTranspiled(filePath) {
    return filePath.indexOf('frontend/harmony') >= 0
}

function last(arr) {
    return arr[arr.length - 1]
}

function fileExtension(fileName) {
    return last(fileName.split('.'))
}

function addLessExtIfNeeded(fileName) {
    if (fileExtension(fileName) !== 'less') {
        return `${fileName}.less`
    } else {
        return fileName
    }
}

function hasTildeImport(lessFile) {
    return (
        lessFile.indexOf("@import '~") >= 0 ||
        lessFile.indexOf('@import "~') >= 0 ||
        lessFile.indexOf("@import (reference) '~") >= 0 ||
        lessFile.indexOf('@import (reference) "~') >= 0
    )
}

function updateTildePaths(lessFile) {
    var modifiedFile = lessFile
    var regex = /@import(.+)([\'\"])~(.*)([\'\"])/g
    var matches = regex.exec(lessFile)

    while (matches) {
        try {
            console.log('modified file name', addLessExtIfNeeded(matches[3]))
            modifiedFile = modifiedFile.replace(
                matches[0],
                `@import${matches[1]}${matches[2]}/frontend/harmony/src/pp/core/less/${addLessExtIfNeeded(
                    matches[3]
                )}${matches[4]}`
            )
        } catch (e) {
            console.error('error replacing modified stuff', lessFile)
        }
        matches = regex.exec(lessFile)
    }

    return modifiedFile
}

function lessLoader(filePath) {
    const lessFile = fs.readFileSync(filePath, 'utf8')

    if (hasTildeImport(lessFile)) {
        return updateTildePaths(lessFile)
    } else {
        return lessFile
    }
}

function getContent(filePath) {
    if (shouldBeTranspiled(filePath)) {
        var transformed = babel.transformFileSync(filePath, opts)
        return transformed.code
    } else {
        return fs.readFileSync(filePath, 'utf8')
    }
}

// send the correct contentType header
http
    .createServer(function(req, response) {
        var filePath = req.url.slice(1)

        console.log('filePath', filePath)
        if (fs.existsSync(filePath)) {
            response.writeHead(200)
            if (last(filePath.split('.')) === 'js') {
                response.end(getContent(filePath), 'utf-8')
            } else if (fileExtension(filePath) === 'less') {
                response.end(lessLoader(filePath), 'utf8')
            } else {
                response.end(fs.readFileSync(filePath), 'utf-8')
            }
        } else {
            response.writeHead(500)
            response.end('file does not exist')
            response.end()
        }
    })
    .listen(8000)

process.on('uncaughtException', function(err) {
    console.error('Uncaught exception', err)
})
