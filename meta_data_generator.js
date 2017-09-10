const reactDocs = require('react-docgen')
const fakeProps = require('react-fake-props/src')
const path = require('path')
const exec = require('child_process').exec
const fs = require('fs')

const { getNameFromPath } = require('./belt.js')

const docgenOutputFile = 'components.docgen.json'
const finalMetaFile = 'components.meta.json'

const configFilePath =
    process.argv.length > 2
        ? process.argv[2].split('=')[1]
        : './reactpen.config.js'
const config = require(configFilePath)

exec(
    `./node_modules/.bin/react-docgen ${config.componentsPath} -o ${docgenOutputFile} --pretty`,
    function(err, stdout) {
        if (err) {
            console.error('error while generating docs for components', err)
        } else {
            fs.readFile(docgenOutputFile, 'utf-8', function(err, meta) {
                if (err) {
                    console.error('Error reading docgen generated file', err)
                } else {
                    const metaData = JSON.parse(meta)
                    const componentPaths = Object.keys(metaData)
                    const metaDataWithFakeProps = componentPaths.map(function(
                        path
                    ) {
                        return Object.assign(
                            {
                                name: getNameFromPath(path),
                                path: path
                            },
                            metaData[path]
                        )
                        // let fp = null
                        // try {
                        //     fp = fakeProps(path, { optional: false })
                        // } catch (e) {
                        //     console.error(
                        //         'error generating fake props for ',
                        //         path,
                        //         ' Reason: ',
                        //         e
                        //     )
                        // }

                        // if (fp) {
                        //     return Object.assign(
                        //         {
                        //             name: getNameFromPath(path),
                        //             path: path,
                        //             // doing the reduce stuff because JSON stringify doesn't work on function just like that. need to convert functions to string for JSON stringify to include them
                        //             fakeProps: Object.keys(fp).reduce(function(
                        //                 acc,
                        //                 key
                        //             ) {
                        //                 return Object.assign({}, acc, {
                        //                     [key]:
                        //                         typeof fp[key] === 'function'
                        //                             ? fp[key] + ''
                        //                             : fp[key]
                        //                 })
                        //             }, {})
                        //             // typeof fp === 'function' ? fp + '' : fp
                        //         },
                        //         metaData[path]
                        //     )
                        // } else {
                        //     return Object.assign(
                        //         {
                        //             name: getNameFromPath(path),
                        //             path: path
                        //         },
                        //         metaData[path]
                        //     )
                        // }
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
