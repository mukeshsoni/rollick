import React from 'react'
import PropTypes from 'prop-types'
import docgen from 'react-docgen'

import Button from '../buttons/button.js'
import PropsAndMethods from '../previews/props_and_methods.js'
import PreviewCodeSection from '../previews/preview_code_section.js'
import SingleComponentPreview from '../previews/single_component_preview.js'
import StyleguidePlaygroundHeader from './styleguide_playground_header.js'

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
    getStoryBoards() {
        let {
            item,
            onCodeChange,
            onEditorFocusChange,
            onSavePropClick,
            onFormatCodeClick,
            savingProps
        } = this.props

        let jsUrlsToInsert = [
            'jspm_packages/npm/codemirror@5.31.0/mode/jsx/jsx.js'
        ]

        let cssUrlsToInsert = [
            'node_modules/codemirror/lib/codemirror.css',
            'node_modules/codemirror/theme/base16-light.css'
        ]
        let cssToInsertInIframe = '.ReactCodeMirror .CodeMirror {height: 100%}'

        let boards = item.stories.map((story, index) => {
            return (
                <div>
                    <div style={{ height: 'auto' }}>
                        <SingleComponentPreview
                            jsUrlsToInsert={jsUrlsToInsert}
                            cssUrlsToInsert={cssUrlsToInsert}
                            cssToInsert={cssToInsertInIframe}
                            item={item}
                            jsxCode={story.jsxCode}
                        />
                    </div>
                    <div style={{ marginBottom: 32 }}>
                        <PreviewCodeSection
                            item={item}
                            jsxCode={story.jsxCode}
                            onCodeChange={onCodeChange.bind(null, index)}
                            onEditorFocusChange={onEditorFocusChange}
                            onSavePropClick={onSavePropClick.bind(null, index)}
                            onFormatCodeClick={onFormatCodeClick.bind(
                                null,
                                index
                            )}
                            savingProps={savingProps}
                        />
                    </div>
                </div>
            )
        })

        return boards
    }

    render() {
        let {
            item,
            onAddComponent,
            onCodeChange,
            jsxCode,
            onEditorFocusChange,
            onSavePropClick,
            onFormatCodeClick,
            savingProps
        } = this.props

        if (!item) {
            return <EmptyStyleguidePlayground />
        }

        const bodyStyle = {
            padding: '6em'
        }

        // console.log(
        //     'jsdoc ',
        //     docgen.utils.docblock.getDoclets(item.description)
        // )

        return (
            <div style={bodyStyle}>
                <StyleguidePlaygroundHeader
                    item={item}
                    onAddComponent={onAddComponent}
                />
                {item.description &&
                    <div style={{ marginBottom: 16 }}>
                        {item.description}
                    </div>}
                {this.getStoryBoards()}
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
    onFormatCodeClick: PropTypes.func.isRequired,
    savingProps: PropTypes.bool
}

StyleguidePlayground.defaultProps = {
    savingProps: false
}

export default StyleguidePlayground
