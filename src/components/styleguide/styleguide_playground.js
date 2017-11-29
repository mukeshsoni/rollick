import React from 'react'
import PropTypes from 'prop-types'
import docgen from 'react-docgen'

import Button from '../buttons/button.js'
import PropsAndMethods from '../previews/props_and_methods.js'
import PreviewCodeSection from '../previews/preview_code_section.js'
import SingleComponentPreview from '../previews/single_component_preview.js'
import StyleguidePlaygroundHeader from './styleguide_playground_header.js'
import { getSavedStories } from '../../persist.js'

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

function arePropsDirtyForStory(componentPath, story, storyIndex) {
    let savedStories = getSavedStories(componentPath)

    if (savedStories.length === 0 || !savedStories[storyIndex]) {
        return true
    } else {
        return savedStories[storyIndex].jsxCode !== story.jsxCode
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
            onDeleteStory,
            onAddComponent
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
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            marginBottom: '1em'
                        }}
                    >
                        <Button
                            label="Use this story"
                            size="small"
                            onClick={onAddComponent.bind(null, index)}
                            style={{ marginLeft: '1em' }}
                        />
                        <Button
                            label="Delete story"
                            size="small"
                            onClick={onDeleteStory.bind(null, index)}
                        />
                    </div>
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
                            propsDirty={arePropsDirtyForStory(
                                item.path,
                                story,
                                index
                            )}
                            onFormatCodeClick={onFormatCodeClick.bind(
                                null,
                                index
                            )}
                            savingProps={story.savingProps}
                        />
                    </div>
                </div>
            )
        })

        return boards
    }

    render() {
        let { item, onAddStory } = this.props

        if (!item) {
            return <EmptyStyleguidePlayground />
        }

        const bodyStyle = {
            padding: '6em',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden',
            height: '100%'
        }

        // console.log(
        //     'jsdoc ',
        //     docgen.utils.docblock.getDoclets(item.description)
        // )

        return (
            <div style={bodyStyle}>
                <StyleguidePlaygroundHeader
                    item={item}
                    onAddStory={onAddStory}
                />
                <div style={{ padding: '1em', flexGrow: 1, overflowY: 'auto' }}>
                    {item.description &&
                        <div style={{ marginBottom: 16 }}>
                            {item.description}
                        </div>}
                    {this.getStoryBoards()}
                    <div style={{ marginBottom: 32 }}>
                        <PropsAndMethods item={item} />
                    </div>
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
    /**
      * callback invoked when 'Add New Story' button is clicked
      **/
    onAddStory: PropTypes.func.isRequired,
    /**
     * callback invoked when 'Delete story' button is clicked
     **/
    onDeleteStory: PropTypes.func.isRequired
}

StyleguidePlayground.defaultProps = {}

export default StyleguidePlayground
