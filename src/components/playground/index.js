import React from 'react'
import PropTypes from 'prop-types'
import SearchBox from '../search_box/index.js'
import SearchInput from '../search_box/search_input.js'
import Button from '../buttons/button'
import debounce from 'debounce'
import SplitPane from 'react-split-pane'
import cssbeautify from 'cssbeautify'
import './app.css'
import './split_pane.css'
import EditInline from '../../components/inputs/edit_inline.js'
import Preview from '../previews/composite_component_preview.js'
import Editor from './editor/index.js'
import LoadPenModal from './load_pen_modal.js'
import FileSaver from 'file-saver'
import belt from '../../../belt.js'
import assoc from '../../tools/assoc.js'
import {
    savePenToDisk,
    getSavedPen,
    lastSavedPen,
    updatePenName
} from '../../persist.js'
const { any, isCapitalized, last, dedupe, fileExtension } = belt
import { formatCode } from '../../tools/code_formatter.js'
import {
    transpile,
    jsxToJs,
    compileCss,
    wrapCss,
    addComponentToExistingJsx
} from '../../tools/transpile_helpers.js'
import loadComponentFromPath from './load_component_from_path.js'
import {
    getAllSavedComponentsData,
    saveAllComponentsData
} from '../../persist.js'

const rightPaneId = 'reactpen-right-pane'

export default class Playground extends React.Component {
    handleExportPropsClick = e => {
        // TODO - the export should export saved props/jsx for all components
        var blob = new Blob(
            [JSON.stringify(getAllSavedComponentsData(), null, 2)],
            {
                type: 'text/plain;charset=utf-8'
            }
        )
        FileSaver.saveAs(blob, 'rollick-saved-props.json')
    }

    handleImportPropsClick = e => {
        document.getElementById('import-component-data').click()
    }

    importComponentData = e => {
        var file = e.target.files[0]
        if (!file) {
            return
        }

        var reader = new FileReader()
        reader.onload = e => {
            try {
                const componentsData = JSON.parse(e.target.result)
                saveAllComponentsData(componentsData)
            } catch (e) {
                console.error('could not parse json', e)
            }
        }

        reader.readAsText(file)
    }

    addComponentFromStyleguide = component => {
        this.handleSearchSelection(component)
    }

    penSaved = () => {
        return this.state.penId
    }

    savePen = () => {
        let penId, penName

        if (this.penSaved()) {
            penId = this.state.penId
            penName = this.state.penName
        } else {
            penId = Math.floor(Math.random() * 10000)
            penName = 'Untitled-' + Math.floor(Math.random() * 1000)
            this.setState({ penId, penName })
        }

        let { jsx, js, css } = this.state
        savePenToDisk(
            { jsxCode: jsx.code, jsCode: js.code, cssCode: css.code },
            penId,
            penName
        )
    }

    handlePenNameChange = newName => {
        this.setState({ penName: newName }, () => {
            updatePenName(this.state.penId, this.state.penName)
        })
    }

    clearAll = () => {
        this._updateJsx('')
        this._updateJs('')
        this._updateCss('')
        setTimeout(this.reloadPreview, 20)
    }

    saveUnsavedWork = () => {
        // save unsaved work for a saved pen
        if (this.state.penId) {
            this.savePen()
        }
    }

    handleNewPenClick = () => {
        this.saveUnsavedWork()

        this.setState(
            {
                penId: null
            },
            this.clearAll
        )
    }

    handleLoadPenClick = () => {
        this.setState({ showSavedPensModal: true })
    }

    reloadPreview = () => {
        this.loadCustomComponents()
        this.formatJsx() // putting formatting stuff after loading, since they might blow up and not lead to loading of custom components at all
        this.formatJs()
        this.formatCss()
    }

    loadPen = id => {
        let savedPen = getSavedPen(id)
        if (savedPen) {
            this.saveUnsavedWork()
            this.setState(
                {
                    penId: id,
                    penName: savedPen.name,
                    showSavedPensModal: false
                },
                () => {
                    this._updateJsx(savedPen.jsxCode)
                    this._updateJs(savedPen.jsCode)
                    this._updateCss(savedPen.cssCode)
                    setTimeout(this.reloadPreview, 20)
                }
            )
        } else {
            this.setState({ showSavedPensModal: false })
        }
    }

    exportPen = () => {
        const { js, jsx, css } = this.state
        const json = { jsCode: js.code, jsxCode: jsx.code, cssCode: css.code }

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
                    this._updateJsx(jsxCode)
                    this._updateJs(jsCode)
                    this._updateCss(cssCode)

                    this.setState({ loading: true }, this.reloadPreview)
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

    handleSearchSelection = selectedItem => {
        // handleSearchSelection is called even if enter is pressed when there are zero search results
        if (selectedItem && selectedItem.path) {
            this.hideSearchModal()
            loadComponentFromPath(selectedItem)
                .then(com => {
                    window[selectedItem.name] =
                        com.component.default || com.component
                    let jsxWithNewComponent = addComponentToExistingJsx(
                        this.state.jsx.code,
                        this.jsxEditorRef.codeMirrorRef
                            .getCodeMirror()
                            .getCursor(),
                        { ...selectedItem, fakeProps: selectedItem.fakeProps }
                    )

                    // TODO - no idea why i am doing so much stuff here. Need to refactor
                    // TODO - need to probably format code after adding component
                    this.updateJsx(jsxWithNewComponent)
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
        this.setState({
            css: {
                code: cssbeautify(this.state.css.code)
            }
        })
    }

    // formats both js and jsx code
    // mode can be oneOf(['js', 'jsx'])
    formatJsLikeCode = mode => {
        const code = this.state[mode].code
        const codeMirrorRef = this[`${mode}EditorRef`].codeMirrorRef

        const formatted = formatCode(
            code,
            codeMirrorRef.getCodeMirror().getCursor()
        )

        if (!formatted.error) {
            this.setState(
                {
                    [mode]: {
                        code:
                            mode === 'jsx'
                                ? formatted.formattedCode.slice(1)
                                : formatted.formattedCode,
                        toInsert: this.state[mode].toInsert
                    }
                },
                () => {
                    codeMirrorRef.getCodeMirror().setCursor(formatted.cursor)
                }
            )
        } else {
            this.setState({
                [mode]: assoc(
                    error,
                    formatted.error.toString(),
                    this.state[mode]
                )
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
        return this.saveCode('jsxCode', this.state.jsx.code)
    }

    saveJsCode = () => {
        return this.saveCode('jsCode', this.state.js.code)
    }

    saveCssCode = () => {
        return this.saveCode('cssCode', this.state.css.code)
    }

    _updateJsx = newCode => {
        const js = jsxToJs(newCode, this.state.jsx.toInsert)

        this.setState({
            jsx: {
                code: newCode,
                toInsert: js.transpiledCode,
                error: js.error
            }
        })
    }

    updateJsx = debounce(newCode => {
        this._updateJsx(newCode)
    }, 300)

    _updateCss = newCode => {
        compileCss(newCode)
            .then(css => {
                this.setState({
                    css: {
                        code: newCode,
                        toInsert: css.transpiledCode,
                        error: ''
                    }
                })
            })
            .catch(css => {
                this.setState({
                    css: {
                        code: newCode,
                        toInsert: this.state.css.toInsert,
                        error: css.error
                    }
                })
            })
    }

    updateCss = debounce(newCode => {
        this._updateCss(newCode)
    }, 300)

    _updateJs = newCode => {
        const js = transpile(newCode, this.state.js.toInsert)
        this.setState({
            js: {
                code: newCode,
                toInsert: js.transpiledCode,
                error: js.error
            }
        })
    }

    updateJs = debounce(newCode => {
        this._updateJs(newCode)
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
                    const js = transpile(`<div>${this.state.jsx.code}</div>`)

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

        let savedPen = lastSavedPen()
        let penId = savedPen.id
        let penName = savedPen.name
        const startingJsx = (savedPen && savedPen.jsxCode) || ''
        const startingCss = (savedPen && savedPen.cssCode) || ''
        const startingJs = (savedPen && savedPen.jsCode) || ''

        this.state = {
            penId,
            penName,
            com: null,
            jsx: {
                code: startingJsx,
                toInsert: jsxToJs(startingJsx).transpiledCode,
                error: jsxToJs(startingJsx).error
            },
            css: {
                code: startingCss,
                toInsert: wrapCss(startingCss),
                error: ''
            },
            js: {
                code: startingJs,
                toInsert: transpile(startingJs).transpiledCode,
                error: transpile(startingJs).error
            },
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
        if (this.state.css.code && this.state.css.code.trim() !== '') {
            compileCss(this.state.css.code).then(css => {
                this.setState({
                    css: {
                        toInsert: css.transpiledCode
                    },
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
            jsx,
            css,
            js,
            showSearchModal,
            showSavedPensModal,
            componentsMetaList,
            editorLayout,
            loading,
            penId,
            penName
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
        //       {css.toInsert}
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
                    {showSavedPensModal
                        ? <LoadPenModal
                              onClose={() =>
                                  this.setState({ showSavedPensModal: false })}
                              onSelect={this.loadPen}
                          />
                        : null}
                    {penId &&
                        <div style={{ marginRight: '1em' }}>
                            <EditInline
                                value={penName}
                                onChange={this.handlePenNameChange}
                            />
                        </div>}
                    <Button
                        onClick={this.handleNewPenClick}
                        label="New"
                        style={{ marginRight: '1em' }}
                    />
                    <Button
                        onClick={this.handleLoadPenClick}
                        label="Open"
                        style={{ marginRight: '1em' }}
                    />
                    <Button
                        onClick={this.savePen}
                        label="Save"
                        style={{ marginRight: '1em' }}
                    />
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
                        label="Import saved props"
                        onClick={this.handleImportPropsClick}
                        style={{ marginRight: '1em' }}
                    />
                    <Button
                        label="Export saved props"
                        onClick={this.handleExportPropsClick}
                        style={{ marginRight: '1em' }}
                    />
                    <input
                        type="file"
                        id="import-component-data"
                        style={{ display: 'none' }}
                        onChange={this.importComponentData}
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
                                code={jsx.code}
                                onCodeChange={this.updateJsx}
                                mode="jsx"
                                editorName="JSX"
                                autoFocus={true}
                                extraKeys={jsxEditorExtraKeys}
                                onFormatClick={this.formatJsx}
                                errors={jsx.error}
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
                                    code={css.code}
                                    onCodeChange={this.updateCss}
                                    mode="css"
                                    editorName="CSS"
                                    onFormatClick={this.formatCss}
                                    errors={css.error}
                                />
                                <Editor
                                    ref={instance =>
                                        (this.jsEditorRef = instance)}
                                    code={js.code}
                                    onCodeChange={this.updateJs}
                                    mode="jsx"
                                    editorName="JS"
                                    onFormatClick={this.formatJs}
                                    errors={js.error}
                                />
                            </SplitPane>
                        </SplitPane>
                        <div className="editor-right-pane" id={rightPaneId}>
                            {!this.props.hidePreview &&
                                <Preview
                                    loading={loading}
                                    jsxToInsert={jsx.toInsert}
                                    jsToInsert={js.toInsert}
                                    cssToInsert={css.toInsert}
                                />}
                        </div>
                    </SplitPane>
                </div>
            </div>
        )
    }
}

Playground.propTypes = {
    fromStyleguideClick: PropTypes.func.isRequired,
    showStyleguide: PropTypes.func.isRequired,
    hidePreview: PropTypes.bool.isRequired
}
