import React from 'react'
import CodeMirror from 'react-codemirror'
import jsx from 'jsx-transpiler'
import 'jspm_packages/npm/codemirror@5.29.0/mode/jsx/jsx.js'
import 'jspm_packages/npm/codemirror@5.29.0/mode/css/css.js'
import sass from 'sass.js'
import prettier from 'prettier'
import componentsMetaList from 'components.meta.json!json'
import SearchModal from 'src/components/search_modal'
import Button from 'src/components/buttons/button'
import debounce from 'debounce'
import SplitPane from 'react-split-pane'
import './app.css'
import './split_pane.css'
import './codemirror_custom.css'
import 'node_modules/codemirror/theme/twilight.css!css'
import 'node_modules/codemirror/lib/codemirror.css!css'
// import 'codemirror/lib/codemirror.css'

// oldVal is a hack until we have Either data type support
function jsxToJs(jsxCode, oldVal = '') {
    try {
        const compiledJsx = Babel.transform(`<div>${jsxCode}</div>`, {
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

function getFakePropValue(fakeProp) {
    // doing all this wrapper function stuff, because i serialized function as string. JSON.stringify does not support functions. But to deserialize a function which is encoded as string is tricky.
    // one way is to use eval, but that will just create that function in that scope. No details on what type of data was provided to eval
    // so i created this way where i wrap the JSON thing inside another function. And then call that function and check it's type. I don't stringify the JSON thing if it's already a string, since that just puts quotes on the quoted string. Which will make stuff like "function a() {}" into ""function a() {}"" which will then lead to `typeof wrapperFunction()` evaluate to string even for the function encoded as string
    var wrapperFunction
    if (typeof fakeProp === 'string' && fakeProp.indexOf('function ') >= 0) {
        wrapperFunction = new Function('return ' + fakeProp)
    } else {
        wrapperFunction = new Function('return ' + JSON.stringify(fakeProp))
    }

    if (typeof wrapperFunction() === 'function') {
        return wrapperFunction().toString()
    } else {
        return JSON.stringify(fakeProp)
    }
}

function addComponent(jsx, codeMirror, componentDetails) {
    let codeToInsert = `<${componentDetails.name} `
    let propValuePairs = Object.keys(
        componentDetails.props
    ).reduce((acc, propName) => {
        if (
            componentDetails.fakeProps &&
            componentDetails.fakeProps[propName]
        ) {
            return (
                acc +
                ` ${propName}={${getFakePropValue(
                    componentDetails.fakeProps[propName]
                )}}`
            )
        } else {
            return acc + ` ${propName}={'https://unsplash.it/250/250'}`
        }
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

export class App extends React.Component {
    handleSearchSelection = selectedItem => {
        this.hideSearchModal()
        SystemJS.import(selectedItem.path)
            .then(com => {
                console.log('component loaded', com)
                window[selectedItem.name] = com.default
                this.setState(
                    {
                        jsxCode: addComponent(
                            this.state.jsxCode,
                            this.jsxCodemirror.getCodeMirror(),
                            selectedItem
                        )
                    },
                    this.formatJsx
                )
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
        function last(arr) {
            return arr[arr.length - 1]
        }

        function cmToPrettierCursorOffset(code, cursor) {
            const allLines = code.split('\n')
            const charsInLineBeforeCursor =
                cursor.line > 1
                    ? allLines.slice(0, cursor.line - 1).join('\n').length
                    : 0
            return charsInLineBeforeCursor + cursor.ch
        }

        function prettierToCodeMirrorCursor(code, cursorOffset) {
            const codeTillCursorOffset = code.slice(0, cursorOffset)

            const lineNumber = codeTillCursorOffset.split('\n').length
            const charNumber = last(codeTillCursorOffset.split('\n')).length
            return { line: lineNumber, ch: charNumber }
        }

        const prettierCursorOffset = cmToPrettierCursorOffset(
            this.state.jsxCode,
            this.jsxCodemirror.getCodeMirror().getCursor()
        )

        console.log(
            'current jsx cursor position',
            this.jsxCodemirror.getCodeMirror().getCursor()
        )
        console.log('converted prettier cursor offset', prettierCursorOffset)
        const prettified = prettier.formatWithCursor(this.state.jsxCode, {
            semi: false,
            cursorOffset: prettierCursorOffset
        })

        const cmCursor = prettierToCodeMirrorCursor(
            prettified.formatted,
            prettified.cursorOffset
        )

        console.log('prettified cursor offset', prettified.cursorOffset)
        console.log('cm cursor after formatting', cmCursor)
        this.setState(
            {
                jsxCode: prettified.formatted.slice(1) // slice(1) to remove the semicolon at the start of block prettier adds
            },
            () => {
                this.jsxCodemirror.getCodeMirror().setValue(this.state.jsxCode)
                this.jsxCodemirror.getCodeMirror().setCursor(cmCursor)
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

    adjustEditorSizes = () => {
        this.jsxCodemirror
            .getCodeMirror()
            .setSize('100%', this.jsxContainerRef.clientHeight - 60)
        this.cssCodemirror
            .getCodeMirror()
            .setSize('100%', this.cssContainerRef.clientHeight - 60)
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
                console.log('esc in app.js')
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

        const startingJsx = ''
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

    componentDidMount() {
        document.addEventListener('keypress', this.handleKeypress)
        this.adjustEditorSizes()
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.handleKeypress)
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

        const jsxCodeMirrorOptions = {
            lineNumbers: true,
            lineWrapping: true,
            theme: 'twilight',
            extraKeys: {
                'Ctrl-Alt-Space': this.formatJsx
            },
            mode: 'jsx'
        }

        const cssCodeMirrorOptions = {
            lineNumbers: true,
            lineWrapping: true,
            theme: 'twilight',
            mode: 'css'
        }

        return (
            <div className="page-container">
                <style>
                    {this.state.cssToInsert}
                </style>
                <header
                    style={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        padding: '1em',
                        borderBottom: '5px solid #343436',
                        boxShadow: '0 1px 1px black',
                        background: '#141516',
                        height: 69,
                        minHeight: 69
                    }}
                >
                    <Button onClick={this.run} label="Run" />
                    <Button
                        onClick={this.formatJsx}
                        label="Format jsx"
                        style={{ marginRight: '1em' }}
                    />
                </header>
                <SplitPane
                    split="vertical"
                    defaultSize={500}
                    minSize={400}
                    pane2Style={{ background: 'white' }}
                >
                    <SplitPane
                        split="horizontal"
                        defaultSize="50%"
                        minSize={300}
                        onChange={this.adjustEditorSizes}
                    >
                        <div
                            ref={instance => (this.jsxContainerRef = instance)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            <div className="editor-header">
                                <h2>JSX</h2>
                            </div>
                            <CodeMirror
                                ref={instance =>
                                    (this.jsxCodemirror = instance)}
                                autoFocus={true}
                                value={jsxCode}
                                onChange={this.updateJsxCode}
                                options={jsxCodeMirrorOptions}
                                className="codemirror-custom-class"
                            />
                        </div>
                        <div
                            ref={instance => (this.cssContainerRef = instance)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            <div className="editor-header">
                                <h2>SASS</h2>
                            </div>
                            <CodeMirror
                                ref={instance =>
                                    (this.cssCodemirror = instance)}
                                value={this.state.cssCode}
                                onChange={this.updateCssCode}
                                options={cssCodeMirrorOptions}
                            />
                        </div>
                    </SplitPane>
                    <div className="editor-right-pane" id={rightPaneId}>
                        {eval(jsxToInsert)}
                    </div>
                </SplitPane>
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
