import React from 'react'
import PropTypes from 'prop-types'
import SearchResults from './search_results'
import SearchInput from './search_input.js'
import NoSearchResults from './no_search_results.js'
import Modal from 'node_modules/react-modal/dist/react-modal.js'
import classnames from 'classnames'
import deboune from 'debounce'
import key from 'keymaster'
import looseFilter from '../../tools/loose_filter.js'
import './search_box.css'
import { enhanceComponent } from '../../tools/component_loaders.js'
import Story from '../story/index.js'

import belt from '../../../belt.js'
const { findIndex } = belt

function stopAllPropagations(e) {
    e && e.nativeEvent && e.nativeEvent.stopImmediatePropagation()
    e.preventDefault()
    e.stopPropagation()
}

function noop() {}
class SearchBox extends React.Component {
    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    handleItemClick = item => {
        this.setState({
            selectedItemIndex: findIndex(
                this.getFilteredList(),
                i => i.path === item.path
            )
        })
        // this.props.onSelection(item)
    }

    handleEscKey = e => {
        stopAllPropagations(e)
        this.props.onRequestClose()
    }

    handleDownKey = e => {
        stopAllPropagations(e)
        this.setState({
            selectedItemIndex:
                (this.state.selectedItemIndex + 1) %
                this.getFilteredList().length
        })
    }

    handleUpKey = e => {
        stopAllPropagations(e)
        this.setState({
            selectedItemIndex:
                (this.getFilteredList().length +
                    this.state.selectedItemIndex -
                    1) %
                this.getFilteredList().length
        })
    }

    handleEnterKey = e => {
        if (this.state.selectedItemIndex >= 0) {
            stopAllPropagations(e)
            // this.setState({ searchText: '', selectedItemIndex: 0 })
            this.props.onSelection(
                this.getPreviewItem(),
                this.getPreviewItemJsx()
            )
        }
    }

    handleContainerKeyDown = e => {
        const keyCode = e.keyCode || e.which
        if (keyCode === 27) {
            // esc key
            this.handleEscKey()
        }
    }

    handleKeyDown = e => {
        const keyCode = e.keyCode || e.which
        switch (keyCode) {
            case 27:
                return this.handleEscKey()
            case 13: // enter key
                this.handleEnterKey(e)
                break
            case 37: // left arrow
                this.handleLeftKey(e)
                break
            case 38: // up arrow
                this.handleUpKey(e)
                break
            case 39: // right arrow
                this.handleRightKey(e)
                break
            case 40: // down arrow
                this.handleDownKey(e)
                break
        }
    }

    getZeroResultsView = () => {
        return <NoSearchResults />
    }

    getFilteredList = () => {
        const { searchText } = this.state

        if (searchText.trim() === '') {
            return []
        } else {
            return looseFilter(this.props.items, 'name', searchText)
        }
    }

    showPreview = com => {
        this.setState({ previewItem: enhanceComponent(com) })
    }

    hidePreview = () => {
        this.setState({ previewItem: null })
    }

    // toggle preview on click of preview button
    handleShowPreviewClick = item => {
        function sameItemPreviewClicked(newItem, previewItem) {
            if (!previewItem) {
                return false
            }

            return previewItem.path === newItem.path
        }

        if (sameItemPreviewClicked(item, this.state.previewItem)) {
            this.setState({ previewItem: null })
        } else if (item && item.path) {
            this.showPreview(item)
        }
    }

    getPreviewComponentIndex = () => {
        const { previewItem } = this.state

        if (previewItem) {
            return findIndex(
                this.getFilteredList(),
                item => item.path === previewItem.path
            )
        } else {
            return -1
        }
    }

    getInput = () => {
        const { searchText } = this.state

        const inputClassnames = classnames('search-modal-input', {
            'with-results': this.getFilteredList().length > 0
        })

        return (
            <SearchInput
                style={{ width: '100%', flex: '0 0 auto' }}
                ref={node => (this.searchInputRef = node)}
                autoFocus={true}
                onKeyDown={this.handleKeyDown}
                className={inputClassnames}
                value={searchText}
                onChange={this.handleInputChange}
                placeholder="Search Component (Command + i)"
            />
        )
    }

    constructor(props) {
        super(props)

        this.state = {
            searchText: 'react-photo',
            selectedItemIndex: 0,
            previewItem: null
        }

        this.searchInputRef = null
    }

    getPreviewItem = () => {
        if (this.state.selectedItemIndex >= 0) {
            return enhanceComponent(
                this.getFilteredList()[this.state.selectedItemIndex]
            )
        } else {
            return null
        }
    }

    getPreviewItemJsx = () => {
        if (this.getPreviewItem()) {
            return this.getPreviewItem().stories[0].jsxCode
        } else {
            return ''
        }
    }

    componentDidMount() {
        key('esc', this.handleEscKey)
        key('down', this.handleDownKey)
        key('up', this.handleUpKey)
        key('enter', this.handleEnterKey)

        // this.adjustContentContainerHeight()
    }

    adjustContentContainerHeight = () => {
        setTimeout(() => {
            if (this.contentContainerRef) {
                this.contentContainerRef.style.height =
                    this.contentContainerRef.parentElement.offsetHeight -
                    this.contentContainerRef.parentElement.children[0]
                        .offsetHeight
            } else {
                this.adjustContentContainerHeight()
            }
        }, 20)
    }

    render() {
        const { onRequestClose, isOpen } = this.props
        const { selectedItemIndex, previewItem } = this.state

        const modalStyle = {
            overlay: {
                background: 'rgba(255, 255, 255, 0.9)',
                zIndex: 25
            },
            content: {
                padding: 0,
                left: '25%',
                right: '25%',
                top: '25%',
                bottom: '32%',
                overflowY: 'hidden'
            }
        }

        return (
            <Modal
                isOpen={true}
                onRequestClose={onRequestClose}
                closeTimeoutMS={200}
                style={modalStyle}
                contentLabel="Quick search components"
            >
                <div
                    onKeyDown={this.handleContainerKeyDown}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {this.getInput()}
                    {this.getFilteredList().length > 0 ? (
                        <div
                            ref={node => (this.contentContainerRef = node)}
                            style={{
                                display: 'flex',
                                flex: '1 1 auto',
                                // this is not correct. This will keep changing based on the display and browser size
                                height: 480
                            }}
                        >
                            <div style={{ overflowY: 'auto' }}>
                                <SearchResults
                                    items={this.getFilteredList()}
                                    selectedItemIndex={selectedItemIndex}
                                    onItemClick={this.handleItemClick}
                                />
                            </div>
                            <div
                                style={{
                                    flexGrow: 3,
                                    padding: 20,
                                    overflowY: 'auto'
                                }}
                            >
                                <Story
                                    rendering="light"
                                    item={this.getPreviewItem()}
                                    story={
                                        this.getPreviewItem()
                                            ? this.getPreviewItem().stories[0]
                                            : { jsxCode: '' }
                                    }
                                    onCodeChange={noop}
                                    onEditorFocusChange={noop}
                                    onSavePropClick={noop}
                                    onFormatCodeClick={noop}
                                    onDeleteStory={noop}
                                    onAddComponent={this.handleEnterKey}
                                    onStoryTitleChange={noop}
                                    propsDirty={false}
                                />
                            </div>
                        </div>
                    ) : (
                        this.getZeroResultsView()
                    )}
                </div>
            </Modal>
        )
    }
}

SearchBox.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            path: PropTypes.string
        })
    ).isRequired,
    onSelection: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
}

export default SearchBox
