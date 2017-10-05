import React from 'react'
import PropTypes from 'prop-types'
import jsx from 'jsx-transpiler'
import sass from 'sass.js'
import SearchBox from '../search_box/index.js'
import SearchInput from '../search_box/search_input.js'
import Button from '../buttons/button'
import debounce from 'debounce'
import SplitPane from 'react-split-pane'
import cssbeautify from 'cssbeautify'
import './app.css'
import './split_pane.css'
import Preview from '../previews/composite_component_preview.js'
import Editor from './editor/index.js'
import FileSaver from 'file-saver'
import belt from '../../../belt.js'
const { any, isCapitalized, last, dedupe, fileExtension } = belt
import { formatCode } from './code_formatter.js'
import {
    transpile,
    jsxToJs,
    addComponentToExistingJsx
} from './transpile_helpers.js'
import loadComponentFromPath from './load_component_from_path.js'

const rightPaneId = 'reactpen-right-pane'

// TODO - returning the same css for now while trying to load preview in iframe
function wrapCss(css) {
    return css
    // return '#' + rightPaneId + ' { ' + css + ' }'
}

export default class Playground extends React.Component {
    addComponentFromStyleguide = component => {
        this.handleSearchSelection(component)
    }

    exportPen = () => {
        const { jsCode, jsxCode, cssCode } = this.state
        const json = { jsCode, jsxCode, cssCode }

        var blob = new Blob([JSON.stringify(json, null, 2)], {
            type: 'text/plain;charset=utf-8'
        })
        FileSaver.saveAs(blob, 'rollick.json')
    }

    importPen = e => {
        var file = e.target.files[0]
        if (!file) {
            return
        }

        var reader = new FileReader()
        reader.onload = e => {
            try {
                const contents = JSON.parse(e.target.result)
                const { jsCode = '', jsxCode = '', cssCode = '' } = contents

                // TODO - need to wrap jsx in container div if none exists. Otherwise, jsxFormat fails
                if (!jsCode && !jsxCode && !cssCode) {
                    return
                } else {
                    this._updateJsxCode(jsxCode)
                    this._updateJsCode(jsCode)
                    this._updateCssCode(cssCode)

                    this.setState({ loading: true }, () => {
                        this.loadCustomComponents()
                        this.formatJsx() // putting formatting stuff after loading, since they might blow up and not lead to loading of custom components at all
                        this.formatJs()
                        this.formatCss()
                    })
                }
            } catch (e) {
                console.error('could not parse json', e)
            }
        }

        reader.readAsText(file)
    }

    onImportClick = () => {
        document.getElementById('import-file').click()
    }

    registerServiceWorker = () => {
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker
        //         .register('sw_rollick.js')
        //         .then(
        //             registration => {
        //                 // Registration was successful
        //                 console.log(
        //                     'ServiceWorker registration successful with scope: ',
        //                     registration.scope
        //                 )
        //                 navigator.serviceWorker.addEventListener(
        //                     'message',
        //                     event => {
        //                         if (fileExtension(event.data) === 'less') {
        //                             SystemJS.import(event.data + '!')
        //                                 .then(lessContent => {
        //                                     console.log(
        //                                         'less file content',
        //                                         event.data,
        //                                         lessContent
        //                                     )
        //                                 })
        //                                 .catch(err => {
        //                                     console.error(
        //                                         'error loading less file',
        //                                         event.data
        //                                     )
        //                                 })
        //                         } else {
        //                             this.setState({
        //                                 cssFilesToInject: dedupe(
        //                                     this.state.cssFilesToInject.concat(
        //                                         event.data
        //                                     )
        //                                 )
        //                             })
        //                         }
        //                     }
        //                 )
        //             },
        //             function(err) {
        //                 // registration failed :(
        //                 console.error(
        //                     'ServiceWorker registration failed: ',
        //                     err
        //                 )
        //             }
        //         )
        //         .catch(e => {
        //             console.error('error loading service worker file', e)
        //         })
        // }
    }

    handleSearchSelection = selectedItem => {
        // handleSearchSelection is called even if enter is pressed when there are zero search results
        if (selectedItem && selectedItem.path) {
            this.hideSearchModal()
            loadComponentFromPath(selectedItem)
                .then(com => {
                    window[selectedItem.name] =
                        com.component.default || com.component
                    let jsxWithNewComponent = addComponentToExistingJsx(
                        this.state.jsxCode,
                        this.jsxEditorRef.codeMirrorRef
                            .getCodeMirror()
                            .getCursor(),
                        { ...selectedItem, fakeProps: com.fakeProps }
                    )

                    this.jsxEditorRef.codeMirrorRef
                        .getCodeMirror()
                        .setValue(jsxWithNewComponent)

                    // TODO - no idea why i am doing so much stuff here. Need to refactor
                    // TODO - need to probably format code after adding component
                    this.updateJsxCode(jsxWithNewComponent)
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

    // formats both js and jsx code
    // mode can be oneOf(['js', 'jsx'])
    formatJsLikeCode = mode => {
        const code = this.state[`${mode}Code`]
        const codeMirrorRef = this[`${mode}EditorRef`].codeMirrorRef

        // nothing for format
        if (code.trim() === '') {
            return
        }

        const formatted = formatCode(
            code,
            codeMirrorRef.getCodeMirror().getCursor()
        )

        if (!formatted.error) {
            this.setState(
                {
                    [`${mode}Code`]:
                        mode === 'jsx'
                            ? formatted.formattedCode.slice(1)
                            : formatted.formattedCode
                },
                () => {
                    codeMirrorRef
                        .getCodeMirror()
                        .setValue(this.state[`${mode}Code`])
                    codeMirrorRef.getCodeMirror().setCursor(formatted.cursor)
                }
            )
        } else {
            this.setState({
                [`${mode}Error`]: formatted.error.toString()
            })
        }
    }

    formatJs = () => {
        this.formatJsLikeCode('js')
    }

    formatJsx = () => {
        this.formatJsLikeCode('jsx')
    }

    // don't do it any more than once a second. If needed, less (debounce will ensure that)
    saveCode = debounce((key, code) => {
        localStorage.setItem(key, code)
    }, 1000)

    saveJsxCode = () => {
        return this.saveCode('jsxCode', this.state.jsxCode)
    }

    saveJsCode = () => {
        return this.saveCode('jsCode', this.state.jsCode)
    }

    saveCssCode = () => {
        return this.saveCode('cssCode', this.state.cssCode)
    }

    _updateJsxCode = newCode => {
        const js = jsxToJs(newCode, this.state.jsxToInsert)

        this.setState(
            {
                jsxCode: newCode,
                jsxToInsert: js.transpiledCode,
                jsxError: js.error
            },
            this.saveJsxCode
        )
    }

    updateJsxCode = debounce(newCode => {
        this._updateJsxCode(newCode)
    }, 300)

    compileCss = code => {
        return new Promise((resolve, reject) => {
            sass.compile(wrapCss(code), result => {
                if (result.status === 0) {
                    resolve({
                        compiledCode: result.text,
                        error: ''
                    })
                } else {
                    /* console.error('error converting sass to css', result.message)*/
                    reject({ error: result.message })
                }
            })
        })
    }

    _updateCssCode = newCode => {
        this.compileCss(newCode)
            .then(css => {
                this.setState(
                    {
                        cssCode: newCode,
                        cssToInsert: css.compiledCode,
                        cssError: ''
                    },
                    this.saveCssCode
                )
            })
            .catch(css => {
                this.setState({ cssError: css.error })
            })
    }

    updateCssCode = debounce(newCode => {
        this._updateCssCode(newCode)
    }, 300)

    _updateJsCode = newCode => {
        const js = transpile(newCode, this.state.jsToInsert)
        this.setState(
            {
                jsCode: newCode,
                jsToInsert: js.transpiledCode,
                jsError: js.error
            },
            this.saveJsCode
        )
    }

    updateJsCode = debounce(newCode => {
        this._updateJsCode(newCode)
    }, 300)

    hideSearchModal = () => {
        return this.setState({ showSearchModal: false }, () => {
            if (
                this.state.editorInFocus &&
                this.state.editorInFocus.length > 0
            ) {
                this[this.state.editorInFocus + 'EditorRef'].codeMirrorRef
                    .getCodeMirror()
                    .focus()
            }
        })
    }

    adjustEditorSizes = () => {
        const headerHeight = 31
        const footerHeight = 20
        const editors = ['jsx', 'css', 'js']

        if (this.paneContainerRef && this.paneContainerRef.clientHeight) {
            editors.forEach(editor => {
                const editorRef = this[editor + 'EditorRef']
                const parentHeight = this.paneContainerRef.clientHeight

                const editorHeight =
                    parentHeight / 3 - headerHeight - footerHeight
                editorRef.codeMirrorRef &&
                    editorRef.codeMirrorRef
                        .getCodeMirror()
                        .setSize('100%', editorHeight)
            })
        }
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

        function getEditorInFocus(jsxEditor, cssEditor, jsEditor) {
            if (jsxEditor.hasFocus()) {
                return 'jsx'
            } else if (cssEditor.hasFocus()) {
                return 'css'
            } else if (jsEditor.hasFocus()) {
                return 'js'
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
                            this.cssEditorRef.codeMirrorRef.getCodeMirror(),
                            this.jsEditorRef.codeMirrorRef.getCodeMirror()
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

    loadCustomComponents = () => {
        // load custom components, if any, in the jsx editor
        SystemJS.import('components.meta.json!json')
            .then(meta => {
                this.setState({ componentsMetaList: meta }, () => {
                    const js = transpile(`<div>${this.state.jsxCode}</div>`)

                    if (!js.error) {
                        const customComponentTokens = js.ast.tokens.filter(
                            token => {
                                return (
                                    token.type.label === 'jsxName' &&
                                    isCapitalized(token.value)
                                )
                            }
                        )

                        const componentsToLoad = this.state.componentsMetaList.filter(
                            comMeta => {
                                return (
                                    any(
                                        token => token.value === comMeta.name,
                                        customComponentTokens
                                    ) && !window[comMeta.name]
                                )
                            }
                        )

                        const loadPromises = componentsToLoad.map(comMeta => {
                            return SystemJS.import(comMeta.path).then(com => {
                                window[comMeta.name] = com.default || com
                            })
                        })

                        Promise.all(loadPromises)
                            .then(() => {
                                this.setState({ loading: false })
                            })
                            .catch(e => {
                                console.log('error loading component', e)
                                this.setState({ loading: false })
                            })
                    } else {
                        this.setState({ loading: false })
                    }
                })
            })
            .catch(() => this.setState({ loading: false }))
    }

    constructor(props) {
        super(props)

        const startingJsx = localStorage.getItem('jsxCode') || ''
        const startingCss = localStorage.getItem('cssCode') || ''
        const startingJs = localStorage.getItem('jsCode') || ''

        this.state = {
            com: null,
            jsxCode: startingJsx,
            jsxToInsert: jsxToJs(startingJsx).transpiledCode,
            jsxError: jsxToJs(startingJsx).error,
            cssCode: startingCss,
            cssToInsert: wrapCss(startingCss),
            cssError: '',
            jsCode: localStorage.getItem('jsCode') || '',
            jsToInsert: transpile(startingJsx).transpiledCode,
            jsError: transpile(startingJsx).error,
            showSearchModal: false,
            searchText: '',
            componentsMetaList: [],
            editorLayout: 'left',
            loading: true
        }
        this.jsxEditorRef = null
        this.cssEditorRef = null
        this.jsEditorRef = null
        this.paneContainerRef = null
    }

    componentWillMount() {
        // this.registerServiceWorker()

        this.loadCustomComponents()
        // if we set initial cssCode in state from localstorage
        // we can't get the compiled version (wrap with 'right-container' tag and compile with sass compiler)
        // because sass compiler is async
        // triggering css code update so that the load time css code get's compiled
        if (this.state.cssCode && this.state.cssCode.trim() !== '') {
            this.compileCss(this.state.cssCode).then(css => {
                this.setState({
                    cssToInsert: css.compiledCode,
                    error: css.error
                })
            })
        }
    }

    componentDidMount() {
        document.addEventListener('keypress', this.handleKeypress)
        window.adjustment = 10
        this.adjustEditorSizes()
        this.formatJsx()
        this.formatJs()
        this.formatCss()
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
            jsxToInsert,
            jsxError,
            cssCode,
            cssToInsert,
            cssError,
            jsCode,
            jsToInsert,
            jsError,
            showSearchModal,
            componentsMetaList,
            editorLayout,
            loading
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

        //       <style>
        //       {cssToInsert}
        // </style>
        return (
            <div className="page-container">
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
                        minHeight: 69,
                        width: '100%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignSelf: 'flex-start',
                            width: 300,
                            marginRight: 'auto',
                            marginTop: -5,
                            zIndex: 23
                        }}
                    >
                        {showSearchModal
                            ? <SearchBox
                                  items={componentsMetaList}
                                  onSelection={this.handleSearchSelection}
                                  onRequestClose={this.hideSearchModal}
                              />
                            : <div style={{ width: '100%' }}>
                                  <SearchInput
                                      style={{ width: 300 }}
                                      className={inputClassnames}
                                      placeholder="Search Component (Command + i)"
                                      onFocus={() =>
                                          this.setState({
                                              showSearchModal: true
                                          })}
                                  />
                              </div>}
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
                        onClick={this.exportPen}
                        label="Export"
                        style={{ marginRight: '1em' }}
                    />
                    <Button
                        onClick={this.onImportClick}
                        label="Import"
                        style={{ marginRight: '1em' }}
                    />
                    <input
                        type="file"
                        id="import-file"
                        style={{ display: 'none' }}
                        onChange={this.importPen}
                    />
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
                <div
                    style={{
                        height: '100%',
                        display: 'table-cell',
                        position: 'relative'
                    }}
                    ref={node => (this.paneContainerRef = node)}
                >
                    <SplitPane
                        split={
                            editorLayout === 'left' ? 'vertical' : 'horizontal'
                        }
                        minSize={editorLayout === 'left' ? 400 : 300}
                        pane1Style={{ height: '100%' }}
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
                                    code={jsCode}
                                    onCodeChange={this.updateJsCode}
                                    mode="jsx"
                                    editorName="JS"
                                    onFormatClick={this.formatJs}
                                    errors={jsError}
                                />
                            </SplitPane>
                        </SplitPane>
                        <div className="editor-right-pane" id={rightPaneId}>
                            <Preview
                                loading={loading}
                                jsxToInsert={jsxToInsert}
                                jsToInsert={jsToInsert}
                                cssToInsert={this.state.cssToInsert}
                            />
                        </div>
                    </SplitPane>
                </div>
            </div>
        )
    }
}

Playground.propTypes = {
    fromStyleguideClick: PropTypes.func.isRequired,
    showStyleguide: PropTypes.func.isRequired
}
