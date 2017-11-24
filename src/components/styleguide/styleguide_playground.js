import React from 'react'
import PropTypes from 'prop-types'
import docgen from 'react-docgen'

import PropsAndMethods from '../previews/props_and_methods.js'
import PreviewCodeSection from '../previews/preview_code_section.js'
import SingleComponentPreview from '../previews/single_component_preview.js'

class EmptyStyleguidePlayground extends React.PureComponent {
    render() {
        let emptyStyleguidePlaygroundStyles = {
            flex: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '4em',
            color: '#999'
        }

        return (
            <div style={emptyStyleguidePlaygroundStyles}>
                <span>Preview Here</span>
            </div>
        )
    }
}

class StyleguidePlayground extends React.PureComponent {
    render() {
        let {
            item,
            onAddComponent,
            onCodeChange,
            jsxCode,
            onEditorFocusChange,
            onSavePropClick,
            onFormatCodeClick
        } = this.props

        if (!item) {
            return <EmptyStyleguidePlayground />
        }

        let jsUrlsToInsert = [
            'jspm_packages/npm/codemirror@5.31.0/mode/jsx/jsx.js'
        ]

        let cssUrlsToInsert = [
            'node_modules/codemirror/lib/codemirror.css',
            'node_modules/codemirror/theme/base16-light.css'
        ]
        let cssToInsertInIframe = '.ReactCodeMirror .CodeMirror {height: 100%}'

        const bodyStyle = {
            padding: '6em'
        }

        let addButtonStyle = {
            outline: 'none',
            cursor: 'pointer'
        }

        // console.log(
        //     'jsdoc ',
        //     docgen.utils.docblock.getDoclets(item.description)
        // )

        return (
            <div style={bodyStyle}>
                <header
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 42
                    }}
                >
                    <div>
                        <h2
                            style={{
                                marginBottom: 8,
                                fontWeight: 'normal'
                            }}
                        >
                            {item.name}
                        </h2>
                        <div
                            style={{
                                fontSize: '0.9em',
                                color: '#999'
                            }}
                        >
                            {item.path}
                            <button
                                type="button"
                                title="Copy to clipboard"
                                style={{
                                    background: 'transparent',
                                    transition: 'color 750ms ease-out',
                                    color: '#999',
                                    padding: 2,
                                    marginLeft: 4,
                                    cursor: 'pointer'
                                }}
                            >
                                <svg
                                    fill="currentColor"
                                    preserveAspectRatio="xMidYMid meet"
                                    height="1em"
                                    width="1em"
                                    viewBox="0 0 40 40"
                                    style={{ verticalAlign: 'middle' }}
                                >
                                    <g>
                                        <path d="m31.6 35v-23.4h-18.2v23.4h18.2z m0-26.6c1.8 0 3.4 1.4 3.4 3.2v23.4c0 1.8-1.6 3.4-3.4 3.4h-18.2c-1.8 0-3.4-1.6-3.4-3.4v-23.4c0-1.8 1.6-3.2 3.4-3.2h18.2z m-5-6.8v3.4h-20v23.4h-3.2v-23.4c0-1.8 1.4-3.4 3.2-3.4h20z" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={onAddComponent}
                    >
                        <div
                            style={{
                                background: '#24b987',
                                color: 'white',
                                display: 'inline-block',
                                borderRadius: '50%',
                                width: 42,
                                height: 42,
                                textAlign: 'center',
                                verticalAlign: 'center',
                                fontSize: 36,
                                marginRight: 10,
                                padding: 5
                            }}
                        >
                            +
                        </div>
                        <a style={addButtonStyle}>AddThis</a>
                    </div>
                </header>
                {item.description &&
                    <div style={{ marginBottom: 16 }}>
                        {item.description}
                    </div>}
                <div style={{ height: 'auto' }}>
                    <SingleComponentPreview
                        jsUrlsToInsert={jsUrlsToInsert}
                        cssUrlsToInsert={cssUrlsToInsert}
                        cssToInsert={cssToInsertInIframe}
                        item={item}
                        jsxCode={jsxCode}
                    />
                </div>
                <div style={{ marginBottom: 32 }}>
                    <PreviewCodeSection
                        item={item}
                        jsxCode={jsxCode}
                        onCodeChange={onCodeChange}
                        onEditorFocusChange={onEditorFocusChange}
                        onSavePropClick={onSavePropClick}
                        onFormatCodeClick={onFormatCodeClick}
                    />
                </div>
                <div style={{ marginBottom: 32 }}>
                    <PropsAndMethods item={item} />
                </div>
            </div>
        )
    }
}

StyleguidePlayground.contextTypes = {
    window: PropTypes.object,
    document: PropTypes.object
}

StyleguidePlayground.propTypes = {
    /**
    * UI component object which is output by react-docgen, and enhanced with fakeProps
    **/
    item: PropTypes.object.isRequired,
    /**
      * jsx Code string for the component
    **/
    jsxCode: PropTypes.string,
    /**
    * function to call when user wants to add the component to the playground
    **/
    onAddComponent: PropTypes.func.isRequired,
    /**
    * function to callback when jsx code is changed in the code panel
    **/
    onCodeChange: PropTypes.func.isRequired,
    /**
      * When the editor is in focus or goes out of focus
      **/
    onEditorFocusChange: PropTypes.func.isRequired,
    /**
      * callback invoked when 'Save props' button is clicked
      **/
    onSavePropClick: PropTypes.func.isRequired,
    /**
      * callback invoked when 'Format code' button is clicked
      **/
    onFormatCodeClick: PropTypes.func.isRequired
}

export default StyleguidePlayground
