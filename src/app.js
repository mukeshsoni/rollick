import React from 'react'
import CodeMirror from 'react-codemirror'
import jsx from 'jsx-transpiler'
import Avatar from 'reactpen/avatar'
import 'jspm_packages/npm/codemirror@5.29.0/mode/jsx/jsx.js'
import 'jspm_packages/npm/codemirror@5.29.0/mode/css/css.js'
import sass from 'sass.js'
import prettier from 'prettier'
// import 'codemirror/lib/codemirror.css!'

// oldVal is a hack until we have Either data type support
function jsxToJs(jsxCode, oldVal = '') {
    try {
        const compiledJsx = Babel.transform(jsxCode, {
            presets: ['react']
        }).code
        return compiledJsx
    } catch (e) {
        console.log('error compiling jsx', e.toString())
        return oldVal
    }
}

const rightPaneId = 'reactpen-right-pane'

function wrapCss(css) {
    return '#' + rightPaneId + ' { ' + css + ' }'
}

const componentMap = {
    avatar: {
        name: 'Avatar',
        path: 'reactpen/avatar',
        props: {
            src: {
                defaultValue: "'https://unsplash.it/50/50'"
            },
            width: {
                defaultValue: 100
            }
        }
    }
}

export class App extends React.Component {
    addComponent = () => {
        SystemJS.import('reactpen/component.js').then(com => {
            console.log('component loaded', com)
            this.setState({
                com
            })
        })
    }

    addAvatar = () => {
        function addComponent(jsx, codeMirror, componentDetails) {
            let codeToInsert = `<${componentDetails.name} `
            let propValuePairs = Object.keys(
                componentDetails.props
            ).reduce((acc, propName) => {
                if (componentDetails.props[propName].defaultValue) {
                    return `${acc} ${propName}={${componentDetails.props[
                        propName
                    ].defaultValue}}`
                } else {
                    return acc
                }
            }, '')

            codeToInsert = `${codeToInsert} ${propValuePairs}></${componentDetails.name}>`

            codeMirror.replaceSelection(codeToInsert)
            return codeMirror.getValue()
        }

        SystemJS.import(componentMap['avatar'].path).then(com => {
            console.log('component loaded', com)
            window[componentMap['avatar'].name] = com.default
            this.setState({
                jsxCode: addComponent(
                    this.state.jsxCode,
                    this.jsxCodemirror.getCodeMirror(),
                    componentMap['avatar']
                )
            })
        })
    }

    run = () => {
        const { jsxCode, cssCode } = this.state
        this.setState(
            { jsxToInsert: jsxToJs(jsxCode, this.state.jsxToInsert) },
            () => {
                // let styleEl = document.getElementById('global_styles')
                // styleEl.innerHTML = cssCode
            }
        )
    }

    formatJsx = () => {
        console.log('jsxcode', this.state.jsxCode)
        this.setState(
            {
                jsxCode: prettier
                    .format(this.state.jsxCode, { semi: false })
                    .slice(1) // slice(1) to remove the semicolon at the start of block prettier adds
            },
            () => {
                this.jsxCodemirror.getCodeMirror().setValue(this.state.jsxCode)
            }
        )
    }

    updateJsxCode = newCode => {
        this.setState({ jsxCode: newCode })
    }

    updateCssCode = newCode => {
        sass.compile(wrapCss(newCode), result => {
            if (result.status === 0) {
                console.log('sass to css conversion', result)
                this.setState({ cssCode: newCode, cssToInsert: result.text })
            } else {
                console.log('error converting sass to css', result.message)
            }
        })
    }

    constructor(props) {
        super(props)

        const startingJsx = '<div>abc</div>'
        const startingCss = 'div { font-size: 24px; }'

        this.state = {
            com: null,
            jsxCode: startingJsx,
            jsxToInsert: jsxToJs(startingJsx),
            cssCode: startingCss,
            cssToInsert: wrapCss(startingCss)
        }
        this.jsxCodemirror = null
    }

    render() {
        const { com, avatar, jsxCode, cssCode, jsxToInsert } = this.state

        const containerStyle = {
            display: 'grid',
            gridTemplateColumns: '4fr 7fr',
            gridTemplateRows: '40px auto',
            width: '100vw',
            height: '100vh'
        }

        const leftPaneStyle = {
            display: 'flex',
            flexDirection: 'column'
        }

        const rightPaneStyle = { background: 'gray' }
        const htmlContainerStyle = { flex: 1 }
        const cssContainerStyle = { flex: 1 }

        const htmlCodeMirrorOptions = {
            lineNumbers: true
            /* mode: 'jsx'*/
        }

        const cssCodeMirrorOptions = {
            lineNumbers: true,
            mode: 'css'
        }

        return (
            <div style={containerStyle}>
                <header
                    style={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        padding: '1em'
                    }}
                >
                    <button style={{ marginRight: '1em' }} onClick={this.run}>
                        Run
                    </button>
                    <button
                        style={{ marginRight: '1em' }}
                        onClick={this.formatJsx}
                    >
                        Format jsx
                    </button>
                    <button onClick={this.addAvatar}>Add Avatar</button>
                </header>
                <div style={leftPaneStyle}>
                    <div style={htmlContainerStyle}>
                        <CodeMirror
                            ref={instance => (this.jsxCodemirror = instance)}
                            autoFocus={true}
                            value={jsxCode}
                            onChange={this.updateJsxCode}
                            options={htmlCodeMirrorOptions}
                        />
                    </div>
                    <div style={cssContainerStyle}>
                        <CodeMirror
                            value={this.state.cssCode}
                            onChange={this.updateCssCode}
                            options={cssCodeMirrorOptions}
                        />
                    </div>
                </div>
                <div style={rightPaneStyle} id={rightPaneId}>
                    <style>{this.state.cssToInsert}</style>
                    Right pane 3
                    {com ? React.createElement(com.default) : null}
                    {avatar
                        ? React.createElement(avatar.default, {
                              src: 'https://unsplash.it/50/50'
                          })
                        : null}
                    {eval(jsxToInsert)}
                </div>
            </div>
        )
    }
}
