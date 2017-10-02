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
            // console.log('modified file name', addLessExtIfNeeded(matches[3]))
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

module.exports = {
    componentsPath: 'src/components',
    // server specific configuration goes here
    server: {
        loaders: [
            {
                test: /\.less$/,
                loader: function lessLoader(lessFile) {
                    if (hasTildeImport(lessFile)) {
                        return updateTildePaths(lessFile)
                    } else {
                        return lessFile
                    }
                }
            }
        ]
    },
    globals: {
        css: {
            urls: '/not/going/to/work.css'
        }
    }
}
