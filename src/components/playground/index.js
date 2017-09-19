import React from 'react'
import jsx from 'jsx-transpiler'
import sass from 'sass.js'
import prettier from 'prettier'
import SearchBox from '../search_box/index.js'
import SearchInput from '../search_box/search_input.js'
import Button from '../buttons/button'
import debounce from 'debounce'
import SplitPane from 'react-split-pane'
/* import Frame from 'react-frame-component'*/
import cssbeautify from 'cssbeautify'
import './app.css'
import './split_pane.css'
import Preview from './playground_preview/index.js'
import Editor from './editor/index.js'

import belt from '../../../belt.js'
const { last } = belt

import faker from '../../faker.js'
import {
    getPropValue,
    populateDefaultValues
} from '../../component_maker_helpers/prop_value_from_string.js'

// oldVal is a hack until we have Either data type support
function jsxToJs(jsxCode, oldVal = '') {
    try {
        const compiledJsx = Babel.transform(`<div>${jsxCode}</div>`, {
            presets: ['react']
        }).code
        return {
            compiledJsx,
            error: ''
        }
    } catch (e) {
        console.error('error compiling jsx', e.toString())
        return {
            compiledJsx: oldVal,
            error: e.toString()
        }
    }
}

const rightPaneId = 'reactpen-right-pane'

function wrapCss(css) {
    return '#' + rightPaneId + ' { ' + css + ' }'
}

function getFakePropValue(fakeProp) {
    if (typeof fakeProp === 'function') {
        return fakeProp.toString()
    } else {
        return JSON.stringify(fakeProp)
    }
}

function addComponent(jsx, codeMirror, componentDetails) {
    let codeToInsert = `<${componentDetails.name} `
    let propValuePairs = ''
    if (componentDetails.props) {
        let fakeProps

        if (componentDetails.fakeProps) {
            fakeProps = componentDetails.fakeProps
        } else {
            fakeProps = populateDefaultValues(
                componentDetails.props,
                faker(componentDetails.props)
            )
        }
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
    addComponentFromStyleguide = component => {
        this.handleSearchSelection(component)
    }

    registerServiceWorker = () => {
        /* if ('serviceWorker' in navigator) {
         *     navigator.serviceWorker
         *         .register('/sw_rollick.js')
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
                                this.jsxEditorRef.codeMirrorRef.getCodeMirror(),
                                selectedItem
                            )
                        },
                        () => {
                            this.formatJsx()
                            this.jsxEditorRef.codeMirrorRef
                                .getCodeMirror()
                                .focus()
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
    formatCss = () => {
        this.setState(
            {
                cssCode: cssbeautify(this.state.cssCode)
            },
            () => {
                this.cssEditorRef.codeMirrorRef
                    .getCodeMirror()
                    .setValue(this.state.cssCode)
            }
        )
    }

    formatJs = () => {
        this.setState(
            {
                jsCode: prettier.format(this.state.jsCode, { semi: false })
            },
            () => {
                this.jsEditorRef.codeMirrorRef
                    .getCodeMirror()
                    .setValue(this.state.jsCode)
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
            this.jsxEditorRef.codeMirrorRef.getCodeMirror().getCursor()
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
                this.jsxEditorRef.codeMirrorRef
                    .getCodeMirror()
                    .setValue(this.state.jsxCode)
                this.jsxEditorRef.codeMirrorRef
                    .getCodeMirror()
                    .setCursor(cmCursor)
            }
        )
    }

    updateJsxCode = debounce(newCode => {
        const js = jsxToJs(newCode, this.state.jsxToInsert)

        this.setState({
            jsxCode: newCode,
            jsxToInsert: js.compiledJsx,
            jsxError: js.error
        })
    }, 500)

    updateCssCode = debounce(newCode => {
        /* this.setState({ cssCode: newCode, cssToInsert: newCode })*/
        sass.compile(wrapCss(newCode), result => {
            if (result.status === 0) {
                this.setState({
                    cssCode: newCode,
                    cssToInsert: result.text,
                    cssError: ''
                })
            } else {
                console.error('error converting sass to css', result.message)
                this.setState({ cssError: result.message })
            }
        })
    }, 500)

    updateJsCode = debounce(newCode => {
        this.setState({ jsCode: newCode })
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
        const footerHeight = 20
        const editors = ['jsx', 'css', 'js']

        editors.forEach(editor => {
            const editorRef = this[editor + 'EditorRef']

            editorRef.codeMirrorRef &&
                editorRef.codeMirrorRef
                    .getCodeMirror()
                    .setSize(
                        '100%',
                        editorRef.containerRef.clientHeight -
                            headerHeight -
                            footerHeight
                    )
        })
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
                 *     this.jsxEditorRef.codeMirrorRef.getCodeMirror().hasFocus()
                 * ) {*/
                // command + i
                if (e.metaKey) {
                    e.preventDefault()
                    /* this.props.showStyleguide()*/
                    return this.setState({
                        editorInFocus: getEditorInFocus(
                            this.jsxEditorRef.codeMirrorRef.getCodeMirror(),
                            this.cssEditorRef.codeMirrorRef.getCodeMirror()
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
            jsxToInsert: jsxToJs(startingJsx).compiledJsx,
            jsxError: '',
            cssCode: startingCss,
            cssToInsert: wrapCss(startingCss),
            cssError: '',
            jsCode: '',
            showSearchModal: false,
            searchText: '',
            componentsMetaList: [],
            cssFilesToInject: [
                'http://localhost:5000/src/components/search_box/search_item.css'
            ],
            editorLayout: 'left'
        }
        this.jsxEditorRef = null
        this.cssEditorRef = null
        this.jsEditorRef = null
    }

    componentWillMount() {
        this.registerServiceWorker()

        SystemJS.import('components.meta.json!json').then(meta => {
            this.setState({ componentsMetaList: meta })
        })
    }

    componentDidMount() {
        document.addEventListener('keypress', this.handleKeypress)
        this.adjustEditorSizes()
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.handleKeypress)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps !== this.props || nextState !== this.state
    }

    render() {
        const {
            com,
            avatar,
            jsxCode,
            cssCode,
            jsCode,
            jsxToInsert,
            jsxError,
            cssToInsert,
            cssError,
            showSearchModal,
            componentsMetaList,
            editorLayout
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

        const jsxEditorExtraKeys = {
            'Ctrl-Alt-Space': this.formatJsx
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
                        onClick={() =>
                            this.setState(
                                {
                                    editorLayout:
                                        this.state.editorLayout === 'left'
                                            ? 'top'
                                            : 'left'
                                },
                                () => {
                                    this.adjustEditorSizes()
                                    if (this.state.editorLayout === 'top') {
                                        document
                                            .getElementsByClassName(
                                                'SplitPane horizontal'
                                            )[0]
                                            .style.setProperty('top', '69px')
                                    }
                                }
                            )}
                        label="Toggle editor layout"
                    />
                </header>
                <div>
                    <SplitPane
                        split={
                            editorLayout === 'left' ? 'vertical' : 'horizontal'
                        }
                        minSize={editorLayout === 'left' ? 400 : 300}
                        pane2Style={{ background: 'white' }}
                        onChange={this.adjustEditorSizes}
                    >
                        <SplitPane
                            split={
                                editorLayout === 'left'
                                    ? 'horizontal'
                                    : 'vertical'
                            }
                            defaultSize="33%"
                            minSize={300}
                            onChange={this.adjustEditorSizes}
                        >
                            <Editor
                                ref={instance => (this.jsxEditorRef = instance)}
                                code={jsxCode}
                                onCodeChange={this.updateJsxCode}
                                mode="jsx"
                                editorName="JSX"
                                autoFocus={true}
                                extraKeys={jsxEditorExtraKeys}
                                onFormatClick={this.formatJsx}
                                errors={jsxError}
                            />
                            <SplitPane
                                split={
                                    editorLayout === 'left'
                                        ? 'horizontal'
                                        : 'vertical'
                                }
                                defaultSize={'50%'}
                                pane2Style={{ background: 'white' }}
                                onChange={this.adjustEditorSizes}
                            >
                                <Editor
                                    ref={instance =>
                                        (this.cssEditorRef = instance)}
                                    code={cssCode}
                                    onCodeChange={this.updateCssCode}
                                    mode="css"
                                    editorName="CSS"
                                    onFormatClick={this.formatCss}
                                    errors={cssError}
                                />
                                <Editor
                                    ref={instance =>
                                        (this.jsEditorRef = instance)}
                                    code={cssCode}
                                    onCodeChange={this.updateJsCode}
                                    mode="javascript"
                                    editorName="JS"
                                    onFormatClick={this.formatJs}
                                />
                            </SplitPane>
                        </SplitPane>
                        <div className="editor-right-pane" id={rightPaneId}>
                            <Preview
                                jsxToInsert={jsxToInsert}
                                jsToInsert={jsCode}
                            />
                        </div>
                    </SplitPane>
                </div>
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
