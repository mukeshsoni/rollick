function last(arr) {
    return arr[arr.length - 1]
}

function capitalize(str) {
    if (str && str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    } else {
        return str
    }
}

function camelCaseFileName(fileName) {
    return fileName.split('.')[0].split('_').map(capitalize).join('')
}

function getNameFromPath(path) {
    const filePathParts = path.split('/')

    // if file is some variant of index.js or index.jsx or index.xyx.js, we need to taret the folder it's inside
    if (last(filePathParts).split('.')[0] === 'index.js') {
        return camelCaseFileName(last(filePathParts.slice(1)))
    } else {
        return camelCaseFileName(last(filePathParts))
    }
}

module.exports = {
    last,
    capitalize,
    camelCaseFileName,
    getNameFromPath
}
