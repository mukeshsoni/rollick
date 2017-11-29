import React from 'react'
import PropTypes from 'prop-types'
import docgen from 'react-docgen'

import PropsAndMethods from '../previews/props_and_methods.js'
import StyleguidePlaygroundHeader from './styleguide_playground_header.js'
import { getSavedStories } from '../../persist.js'
import Story from '../story/index.js'

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
            onAddComponent,
            onStoryTitleChange
        } = this.props

        return item.stories.map((story, index) => {
            return (
                <Story
                    item={item}
                    story={story}
                    onCodeChange={onCodeChange.bind(null, index)}
                    onEditorFocusChange={onEditorFocusChange}
                    onSavePropClick={onSavePropClick.bind(null, index)}
                    onFormatCodeClick={onFormatCodeClick.bind(null, index)}
                    onDeleteStory={onDeleteStory.bind(null, index)}
                    onAddComponent={onAddComponent.bind(null, index)}
                    onStoryTitleChange={onStoryTitleChange.bind(null, index)}
                    propsDirty={arePropsDirtyForStory(item.path, story, index)}
                />
            )
        })
    }

    render() {
        let { item, onAddStory } = this.props

        if (!item) {
            return <EmptyStyleguidePlayground />
        }

        const bodyStyle = {
            padding: '4em',
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
    onDeleteStory: PropTypes.func.isRequired,
    /**
     * callback invoked when story title is changed
     **/
    onStoryTitleChange: PropTypes.func.isRequired
}

StyleguidePlayground.defaultProps = {}

export default StyleguidePlayground
