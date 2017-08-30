import React from 'react'
import CodeMirror from 'react-codemirror'
import jsx from 'jsx-transpiler'
import 'jspm_packages/npm/codemirror@5.29.0/mode/jsx/jsx.js'
import 'jspm_packages/npm/codemirror@5.29.0/mode/css/css.js'
import sass from 'sass.js'
import prettier from 'prettier'
import componentsMetaData from 'components.meta.json!json'
import SearchModal from 'src/components/search_modal'
import debounce from 'debounce'

// converting the docgen object to list of components
const componentsMetaList = Object.keys(componentsMetaData).map(comPath => ({
    ...componentsMetaData[comPath],
    path: comPath,
    name: getNameFromPath(comPath)
}))
// import 'codemirror/lib/codemirror.css'

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

function addComponent(jsx, codeMirror, componentDetails) {
    let codeToInsert = `<${componentDetails.name} `
    let propValuePairs = Object.keys(
        componentDetails.props
    ).reduce((acc, propName) => {
        return acc + ` ${propName}={'https://unsplash.it/250/250'}`
    }, '')

    codeToInsert = `${codeToInsert} ${propValuePairs}></${componentDetails.name}>`

    codeMirror.replaceSelection(codeToInsert)
    return codeMirror.getValue()
}

const componentMap = {
    avatar: {
        name: 'Avatar',
        path: 'src/components/avatar.js',
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

export class App extends React.Component {
    handleSearchSelection = selectedItem => {
        this.hideSearchModal()
        SystemJS.import(selectedItem.path)
            .then(com => {
                console.log('component loaded', com)
                window[getNameFromPath(selectedItem.path)] = com.default
                this.setState({
                    jsxCode: addComponent(
                        this.state.jsxCode,
                        this.jsxCodemirror.getCodeMirror(),
                        selectedItem
                    )
                })
            })
            .catch(e =>
                console.log('error loading component', selectedItem.name, e)
            )
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

    updateJsxCode = debounce(newCode => {
        this.setState({
            jsxCode: newCode,
            jsxToInsert: jsxToJs(newCode)
        })
    }, 500)

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

    hideSearchModal = () => {
        return this.setState({ showSearchModal: false }, () => {
            if (
                this.state.editorInFocus &&
                this.state.editorInFocus.length > 0
            ) {
                this[this.state.editorInFocus + 'Codemirror']
                    .getCodeMirror()
                    .focus()
                this[this.state.editorInFocus + 'Codemirror']
                    .getCodeMirror()
                    .setCursor(this.state.jsxEditorCursorPosition)
            }
        })
    }

    handleKeypress = e => {
        const keyCode = e.keyCode || e.which

        function getCursorIfFocused(cm) {
            if (cm.hasFocus()) {
                return cm.getCursor()
            } else {
                return {}
            }
        }

        function getEditorInFocus(jsxEditor, cssEditor) {
            if (jsxEditor.hasFocus()) {
                return 'jsx'
            } else if (cssEditor.hasFocus()) {
                return 'css'
            } else {
                return ''
            }
        }

        switch (keyCode) {
            case 105: // i
                // only show the search box if the jsx code editor is in focus
                if (
                    e.metaKey &&
                    this.jsxCodemirror.getCodeMirror().hasFocus()
                ) {
                    // command + i
                    e.preventDefault()
                    return this.setState({
                        jsxEditorCursorPosition: getCursorIfFocused(
                            this.jsxCodemirror.getCodeMirror()
                        ),
                        cssEditorCursorPosition: getCursorIfFocused(
                            this.cssCodemirror.getCodeMirror()
                        ),
                        editorInFocus: getEditorInFocus(
                            this.jsxCodemirror.getCodeMirror(),
                            this.cssCodemirror.getCodeMirror()
                        ),
                        showSearchModal: true
                    })
                }
                break
            case 27: // esc
                e.preventDefault()
                return this.hideSearchModal()
            case 207: // command + alt + f
                e.preventDefault()
                if (e.altKey && e.shiftKey) {
                    return this.formatJsx()
                }
                break
        }
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
            cssToInsert: wrapCss(startingCss),
            showSearchModal: false,
            searchText: '',
            jsxEditorCursorPosition: {}
        }
        this.jsxCodemirror = null
        this.cssCodemirror = null
    }

    componentWillMount() {
        document.addEventListener('keypress', this.handleKeypress)
    }

    render() {
        const {
            com,
            avatar,
            jsxCode,
            cssCode,
            jsxToInsert,
            showSearchModal
        } = this.state

        const containerStyle = {
            display: 'grid',
            gridTemplateColumns: '4fr 7fr',
            gridTemplateRows: '40px 1fr 1fr',
            width: '100vw',
            height: '100vh'
        }

        const leftPaneStyle = {}

        const rightPaneStyle = {
            background: 'gray',
            gridColumn: '2/-1',
            gridRow: '2/4'
        }
        const htmlContainerStyle = { gridColumn: '1/2', gridRow: 'span 1' }
        const cssContainerStyle = { gridColumn: '1/2', gridRow: 'span 1' }

        const jsxCodeMirrorOptions = {
            lineNumbers: true,
            lineWrapping: true,
            extraKeys: {
                'Ctrl-Alt-Space': this.formatJsx
            },
            mode: 'jsx'
        }

        const cssCodeMirrorOptions = {
            lineNumbers: true,
            lineWrapping: true,
            mode: 'css'
        }

        return (
            <div style={containerStyle}>
                <style>
                    {this.state.cssToInsert}
                </style>
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
                </header>
                <div style={leftPaneStyle}>
                    <div style={htmlContainerStyle}>
                        <CodeMirror
                            ref={instance => (this.jsxCodemirror = instance)}
                            autoFocus={true}
                            value={jsxCode}
                            onChange={this.updateJsxCode}
                            options={jsxCodeMirrorOptions}
                        />
                    </div>
                    <div style={cssContainerStyle}>
                        <CodeMirror
                            ref={instance => (this.cssCodemirror = instance)}
                            value={this.state.cssCode}
                            onChange={this.updateCssCode}
                            options={cssCodeMirrorOptions}
                        />
                    </div>
                </div>
                <div style={rightPaneStyle} id={rightPaneId}>
                    {com ? React.createElement(com.default) : null}
                    {avatar
                        ? React.createElement(avatar.default, {
                              src: 'https://unsplash.it/50/50'
                          })
                        : null}
                    {eval(jsxToInsert)}
                </div>
                <SearchModal
                    isOpen={showSearchModal}
                    items={componentsMetaList}
                    onSelection={this.handleSearchSelection}
                    onRequestClose={this.hideSearchModal}
                />
            </div>
        )
    }
}
