import React from 'react'
import CodeMirror from 'react-codemirror'
import jsx from 'jsx-transpiler'
import Com from 'reactpen/component.js'

// import 'codemirror/lib/codemirror.css!'

export class App extends React.Component {
    handleClick = () => {
        SystemJS.import('reactpen/component.js').then(com => {
            console.log('component loaded', com)
            this.setState({
                com
            })
        })
    }

    updateJsxCode = newCode => {
        this.setState({ jsxCode: newCode })

        try {
            const compiledJsx = Babel.transform(newCode, {
                presets: ['es2015', 'react']
            }).code
            console.log('compiledJsx', compiledJsx)
            this.setState({ jsxToInsert: compiledJsx })
        } catch (e) {
            console.log('error compiling jsx', e.toString())
        }
    }
    constructor(props) {
        super(props)

        const startingJsx = '<div>abc</div>'
        this.state = {
            com: null,
            jsxCode: startingJsx,
            jsxToInsert: Babel.transform(startingJsx, {
                presets: ['react', 'es2015']
            }).code,
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
            lineNumbers: true
        }

        return (
            <div style={containerStyle}>
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
                            onChange={this.cssCode}
                            options={htmlCodeMirrorOptions}
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
