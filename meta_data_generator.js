const reactDocs = require('react-docgen')
const fakeProps = require('react-fake-props')
const path = require('path')
const exec = require('child_process').exec
const fs = require('fs')

const docgenOutputFile = 'components.docgen.json'

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
                        } catch (e) {}

                        if (fp) {
                            return Object.assign(
                                {
                                    name: getNameFromPath(path),
                                    path: path,
                                    fakeProps: fp
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
                        docgenOutputFile,
                        JSON.stringify(metaDataWithFakeProps, null, 4),
                        'utf-8'
                    )
                }
            })
        }
    }
)
