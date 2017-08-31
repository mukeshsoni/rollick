const reactDocs = require('react-docgen')
const fakeProps = require('react-fake-props/src')
const path = require('path')
const exec = require('child_process').exec
const fs = require('fs')

const docgenOutputFile = 'components.docgen.json'
const finalMetaFile = 'components.meta.json'

function capitalize(str) {
    if (str && str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    } else {
        return str
    }
}

function getNameFromPath(path) {
    return path
        .split('/')
        .pop()
        .split('.')[0]
        .split('_')
        .map(capitalize)
        .join('')
}

exec(
    // './node_modules/.bin/react-docgen src/components_to_test -o ' +
    './node_modules/.bin/react-docgen src/components -o ' +
        docgenOutputFile +
        ' --pretty',
    function(err, stdout) {
        if (err) {
            console.log('error while generating docs for components', err)
        } else {
            fs.readFile(docgenOutputFile, 'utf-8', function(err, meta) {
                if (err) {
                    console.log('Error reading docgen generated file', err)
                } else {
                    const metaData = JSON.parse(meta)
                    const componentPaths = Object.keys(metaData)
                    const metaDataWithFakeProps = componentPaths.map(function(
                        path
                    ) {
                        let fp = null
                        try {
                            fp = fakeProps(path, { optional: true })
                        } catch (e) {
                            console.log(
                                'error generating fake props for ',
                                path,
                                ' Reason: ',
                                e
                            )
                        }

                        if (fp) {
                            return Object.assign(
                                {
                                    name: getNameFromPath(path),
                                    path: path,
                                    // doing the reduce stuff because JSON stringify doesn't work on function just like that. need to convert functions to string for JSON stringify to include them
                                    fakeProps: Object.keys(fp).reduce(function(
                                        acc,
                                        key
                                    ) {
                                        return Object.assign({}, acc, {
                                            [key]:
                                                typeof fp[key] === 'function'
                                                    ? fp[key] + ''
                                                    : fp[key]
                                        })
                                    }, {})
                                    // typeof fp === 'function' ? fp + '' : fp
                                },
                                metaData[path]
                            )
                        } else {
                            return Object.assign(
                                {
                                    name: getNameFromPath(path),
                                    path: path
                                },
                                metaData[path]
                            )
                        }
                    })

                    fs.writeFileSync(
                        finalMetaFile,
                        JSON.stringify(metaDataWithFakeProps, null, 4),
                        'utf-8'
                    )
                }
            })
        }
    }
)
