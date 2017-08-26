import React from 'react'
import CodeMirror from 'react-codemirror'
import jsx from 'jsx-transpiler'
import Com from 'reactpen/component.js'
import 'jspm_packages/npm/codemirror@5.29.0/mode/jsx/jsx.js'
import 'jspm_packages/npm/codemirror@5.29.0/mode/css/css.js'

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

export class App extends React.Component {
    handleClick = () => {
        SystemJS.import('reactpen/component.js').then(com => {
            console.log('component loaded', com)
            this.setState({
                com
            })
        })
    }

    run = () => {
        const { jsxCode, cssCode } = this.state
        this.setState(
            { jsxToInsert: jsxToJs(jsxCode, this.state.jsxToInsert) },
            () => {
                let styleEl = document.getElementById('global_styles')
                styleEl.innerHTML = cssCode
            }
        )
    }

    updateJsxCode = newCode => {
        this.setState({ jsxCode: newCode })
    }

    updateCssCode = newCode => {
        this.setState({ cssCode: newCode })
    }

    constructor(props) {
        super(props)

        const startingJsx = '<div>abc</div>'
        this.state = {
            com: null,
            jsxCode: startingJsx,
            jsxToInsert: jsxToJs(startingJsx),
            cssCode: '* {box-sizing: border-box}'
        }
    }

    render() {
        const { com, jsxToInsert } = this.state

        const containerStyle = {
            display: 'grid',
            gridTemplateColumns: '4fr 7fr',
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
            lineNumbers: true,
            mode: 'jsx'
        }

        const cssCodeMirrorOptions = {
            lineNumbers: true,
            mode: 'css'
        }

        return (
            <div style={containerStyle}>
                <header style={{ gridColumn: '1 / -1' }}>
                    <button onClick={this.run}>Run</button>
                </header>
                <div style={leftPaneStyle}>
                    <div style={htmlContainerStyle}>
                        <CodeMirror
                            value={this.state.jsxCode}
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
                <div style={rightPaneStyle}>
                    Right pane 3
                    {com ? React.createElement(com.default) : null}
                    {eval(jsxToInsert)}
                </div>
            </div>
        )
    }
}
