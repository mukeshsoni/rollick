import React from 'react'
import CodeMirror from 'react-codemirror'
import 'jspm_packages/npm/codemirror@5.29.0/mode/jsx/jsx.js'
import 'jspm_packages/npm/codemirror@5.29.0/mode/css/css.js'
/* import 'jspm_packages/npm/codemirror@5.29.0/lib/codemirror.css!css'
 * import 'jspm_packages/npm/codemirror@5.29.0/theme/twilight.css!css'*/
import 'node_modules/codemirror/lib/codemirror.css!css'
import 'node_modules/codemirror/theme/twilight.css!css'
import jsx from 'jsx-transpiler'
import sass from 'sass.js'
import prettier from 'prettier'
import componentsMetaList from 'components.meta.json!json'
import SearchBox from '../search_box/index.js'
import SearchInput from '../search_box/search_input.js'
import Button from '../buttons/button'
import debounce from 'debounce'
import SplitPane from 'react-split-pane'
import Frame from 'react-frame-component'
import cssbeautify from 'cssbeautify'
/* import emmetCodemirror from 'emmet-codemirror'*/
import emmetCodemirror from '@emmetio/codemirror-plugin'
import './app.css'
import './split_pane.css'
import './codemirror_custom.css'
// import 'codemirror/lib/codemirror.css'

import belt from '../../../belt.js'
const { last } = belt

import faker from '../../faker.js'

import codeMirrorInstance from 'node_modules/codemirror/lib/codemirror.js'
emmetCodemirror(codeMirrorInstance)
// oldVal is a hack until we have Either data type support
function jsxToJs(jsxCode, oldVal = '') {
    try {
        const compiledJsx = Babel.transform(`<div>${jsxCode}</div>`, {
            presets: ['react']
        }).code
        return compiledJsx
    } catch (e) {
        console.error('error compiling jsx', e.toString())
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
    let propValuePairs = ''
    if (componentDetails.props) {
        const fakeProps = faker(componentDetails.props)
        propValuePairs = Object.keys(
            componentDetails.props
        ).reduce((acc, propName) => {
            if (fakeProps && fakeProps[propName]) {
                return (
                    acc +
                    ` ${propName}={${getFakePropValue(fakeProps[propName])}}`
                )
            } else if (componentDetails.props[propName].required !== false) {
                return acc + ` ${propName}={'https://unsplash.it/250/250'}`
            } else {
                return acc
            }
        }, '')
    } else {
        propValuePairs = ''
    }

    codeToInsert = `${codeToInsert} ${propValuePairs}></${componentDetails.name}>`

    codeMirror.replaceSelection(codeToInsert)
    return codeMirror.getValue()
}

function dedupe(arr) {
    let seen = {}
    return arr.filter(
        item => (seen.hasOwnProperty(item) ? false : (seen[item] = true))
    )
}

export default class Playground extends React.Component {
    registerServiceWorker = () => {
        /* if ('serviceWorker' in navigator) {
         *     navigator.serviceWorker
         *         .register('/sw_reactpen.js')
         *         .then(
         *             registration => {
         *                 // Registration was successful
         *                 console.log(
         *                     'ServiceWorker registration successful with scope: ',
         *                     registration.scope
         *                 )
         *                 navigator.serviceWorker.addEventListener(
         *                     'message',
         *                     event => {
         *                         this.setState({
         *                             cssFilesToInject: dedupe(
         *                                 this.state.cssFilesToInject.concat(
         *                                     event.data
         *                                 )
         *                             )
         *                         })
         *                     }
         *                 )
         *             },
         *             function(err) {
         *                 // registration failed :(
         *                 console.error(
         *                     'ServiceWorker registration failed: ',
         *                     err
         *                 )
         *             }
         *         )
         * }*/
    }

    handleSearchSelection = selectedItem => {
        // handleSearchSelection is called even if enter is pressed when there are zero search results
        if (selectedItem && selectedItem.path) {
            this.hideSearchModal()
            SystemJS.import(selectedItem.path)
                .then(com => {
                    window[selectedItem.name] = com.default || com
                    this.setState(
                        {
                            jsxCode: addComponent(
                                this.state.jsxCode,
                                this.jsxCodemirror.getCodeMirror(),
                                selectedItem
                            )
                        },
                        () => {
                            this.formatJsx()
                            this.jsxCodemirror.getCodeMirror().focus()
                        }
                    )
                })
                .catch(e =>
                    console.error(
                        'error loading component',
                        selectedItem.name,
                        e
                    )
                )
        }
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

    formatCss = () => {
        this.setState(
            {
                cssCode: cssbeautify(this.state.cssCode)
            },
            () => {
                this.cssCodemirror.getCodeMirror().setValue(this.state.cssCode)
            }
        )
    }

    formatJsx = () => {
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

        const prettified = prettier.formatWithCursor(this.state.jsxCode, {
            semi: false,
            cursorOffset: prettierCursorOffset
        })

        const cmCursor = prettierToCodeMirrorCursor(
            prettified.formatted,
            prettified.cursorOffset
        )

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

    updateCssCode = debounce(newCode => {
        /* this.setState({ cssCode: newCode, cssToInsert: newCode })*/
        sass.compile(wrapCss(newCode), result => {
            if (result.status === 0) {
                this.setState({ cssCode: newCode, cssToInsert: result.text })
            } else {
                console.error('error converting sass to css', result.message)
            }
        })
    }, 500)

    hideSearchModal = () => {
        return this.setState({ showSearchModal: false }, () => {
            if (
                this.state.editorInFocus &&
                this.state.editorInFocus.length > 0
            ) {
                this[this.state.editorInFocus + 'Codemirror']
                    .getCodeMirror()
                    .focus()
            }
        })
    }

    adjustEditorSizes = () => {
        const headerHeight = 30

        this.jsxCodemirror
            .getCodeMirror()
            .setSize('100%', this.jsxContainerRef.clientHeight - headerHeight)
        this.cssCodemirror
            .getCodeMirror()
            .setSize('100%', this.cssContainerRef.clientHeight - headerHeight)
    }

    getIframeHead = () => {
        return (
            <div>
                <style>
                    {this.state.cssToInsert}
                </style>
                {this.state.cssFilesToInject.map(cssFilePath => {
                    return (
                        <link
                            key={'link_tag_' + cssFilePath}
                            type="text/css"
                            rel="stylesheet"
                            href={cssFilePath}
                        />
                    )
                })}
            </div>
        )
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
                /* if (
                 *     e.metaKey &&
                 *     this.jsxCodemirror.getCodeMirror().hasFocus()
                 * ) {*/
                // command + i
                if (e.metaKey) {
                    e.preventDefault()
                    return this.setState({
                        editorInFocus: getEditorInFocus(
                            this.jsxCodemirror.getCodeMirror(),
                            this.cssCodemirror.getCodeMirror()
                        ),
                        showSearchModal: true
                    })
                }
                break
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
        const startingCss = ''

        this.state = {
            com: null,
            jsxCode: startingJsx,
            jsxToInsert: jsxToJs(startingJsx),
            cssCode: startingCss,
            cssToInsert: wrapCss(startingCss),
            showSearchModal: false,
            searchText: '',
            cssFilesToInject: [
                'http://localhost:5000/src/components/search_box/search_item.css'
            ]
        }
        this.jsxCodemirror = null
        this.cssCodemirror = null
    }

    componentWillMount() {
        this.registerServiceWorker()
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
            cssToInsert,
            showSearchModal
        } = this.state

        const modalStyle = {
            overlay: {
                backgroundColor: 'rgba(28, 26, 26, 0.52)'
            },
            content: {
                top: '20%',
                left: 'calc((100vw - 500px)/2)',
                width: 500,
                border: 'none',
                background: 'none'
            }
        }

        const jsxCodeMirrorOptions = {
            lineNumbers: true,
            lineWrapping: true,
            theme: 'twilight',
            extraKeys: {
                'Ctrl-Alt-Space': this.formatJsx
            },
            mode: 'jsx',
            extraKeys: {
                Tab: 'emmetExpandAbbreviation',
                Enter: 'emmetInsertLineBreak'
            }
        }

        const cssCodeMirrorOptions = {
            lineNumbers: true,
            lineWrapping: true,
            theme: 'twilight',
            mode: 'css',
            extraKeys: {
                Tab: 'emmetExpandAbbreviation',
                Enter: 'emmetInsertLineBreak'
            }
        }

        const inputClassnames = 'search-modal-input'

        return (
            <div className="page-container">
                <style>
                    {cssToInsert}
                </style>
                <header
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        color: 'white',
                        padding: '1em',
                        borderBottom: '5px solid #343436',
                        boxShadow: '0 1px 1px black',
                        background: '#141516',
                        height: 69,
                        minHeight: 69
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignSelf: 'flex-start',
                            width: 500,
                            marginRight: 'auto',
                            marginTop: -5
                        }}
                    >
                        {showSearchModal
                            ? <SearchBox
                                  items={componentsMetaList}
                                  onSelection={this.handleSearchSelection}
                                  onRequestClose={this.hideSearchModal}
                              />
                            : <SearchInput
                                  className={inputClassnames}
                                  placeholder="Search Component (Command + i)"
                                  onFocus={() =>
                                      this.setState({ showSearchModal: true })}
                              />}
                        <Button
                            onClick={this.props.fromStyleguideClick}
                            label="Styleguide"
                            style={{
                                marginLeft: '1em',
                                alignSelf: 'flex-start'
                            }}
                        />
                    </div>
                    <Button
                        onClick={this.formatCss}
                        label="Format css"
                        style={{ marginRight: '1em' }}
                    />
                    <Button
                        onClick={this.formatJsx}
                        label="Format jsx"
                        style={{ marginRight: '1em' }}
                    />
                    <Button onClick={this.run} label="Run" />
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
                                codeMirrorInstance={codeMirrorInstance}
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
                                <h2>CSS</h2>
                            </div>
                            <CodeMirror
                                ref={instance =>
                                    (this.cssCodemirror = instance)}
                                value={this.state.cssCode}
                                onChange={this.updateCssCode}
                                options={cssCodeMirrorOptions}
                                codeMirrorInstance={codeMirrorInstance}
                            />
                        </div>
                    </SplitPane>
                    <div className="editor-right-pane" id={rightPaneId}>
                        {eval(jsxToInsert)}
                    </div>
                </SplitPane>
            </div>
        )
        {
            /* <Frame
               style={{
               width: '100%',
               height: 600
               }}
               frameBorder={'0'}
               head={this.getIframeHead()}
               >
               {eval(jsxToInsert)}
               </Frame> */
        }
    }
}
