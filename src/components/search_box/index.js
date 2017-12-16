import React from 'react'
import PropTypes from 'prop-types'
import SearchResults from './search_results'
import SearchInput from './search_input'
import Modal from 'node_modules/react-modal/dist/react-modal.js'
import Preview from '../previews/index.js'
import classnames from 'classnames'
import onClickOutside from 'react-onclickoutside'
import deboune from 'debounce'
import key from 'keymaster'
import looseFilter from '../../tools/loose_filter.js'
import './search_box.css'
import { enhanceComponent } from '../../tools/component_loaders.js'

import belt from '../../../belt.js'
const { findIndex } = belt

function stopAllPropagations(e) {
    e && e.nativeEvent && e.nativeEvent.stopImmediatePropagation()
    e.preventDefault()
    e.stopPropagation()
}

class SearchBox extends React.Component {
    handleClickOutside = e => {
        this.props.onRequestClose()
    }

    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    handleItemClick = item => {
        this.setState({
            selectedItemIndex: findIndex(
                this.getFilteredComponents(),
                i => i.path === item.path
            )
        })
        // this.props.onSelection(item)
    }

    handleEscKey = e => {
        stopAllPropagations(e)
        this.setState({ searchText: '', selectedItemIndex: -1 })
        this.props.onRequestClose()
    }

    handleDownKey = e => {
        stopAllPropagations(e)
        this.setState({
            selectedItemIndex:
                (this.state.selectedItemIndex + 1) %
                this.getFilteredComponents().length
        })
    }

    handleUpKey = e => {
        stopAllPropagations(e)
        this.setState({
            selectedItemIndex:
                (this.getFilteredComponents().length +
                    this.state.selectedItemIndex -
                    1) %
                this.getFilteredComponents().length
        })
    }

    handleEnterKey = e => {
        if (this.state.selectedItemIndex >= 0) {
            stopAllPropagations(e)
            // this.setState({ searchText: '', selectedItemIndex: 0 })
            // this.props.onSelection(
            //     this.getFilteredComponents()[this.state.selectedItemIndex]
            // )
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

    getFilteredComponents = () => {
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
                this.getFilteredComponents(),
                item => item.path === previewItem.path
            )
        } else {
            return -1
        }
    }

    getInput = () => {
        const { searchText } = this.state

        const inputClassnames = classnames('search-modal-input', {
            'with-results': this.getFilteredComponents().length > 0
        })

        return (
            <SearchInput
                style={{ width: '100%' }}
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
            searchText: '',
            selectedItemIndex: 0,
            previewItem: null
        }

        this.searchInputRef = null
    }

    getPreviewItem = () => {
        if (this.state.selectedItemIndex >= 0) {
            return enhanceComponent(
                this.getFilteredComponents()[this.state.selectedItemIndex]
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
    }

    render() {
        const { onRequestClose, isOpen } = this.props
        const { selectedItemIndex, previewItem } = this.state

        const modalStyle = {
            overlay: {
                left: '25%',
                right: '25%',
                top: '25%',
                bottom: '25%',
                background: 'rgba(255, 255, 255, 0.9)',
                zIndex: 25
            },
            content: {
                padding: 0
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
                <a className="close-button-modal" onClick={onRequestClose}>
                    +
                </a>
                <div style={{ width: '100%' }}>
                    {this.getInput()}
                    {this.getFilteredComponents().length > 0 && (
                        <div style={{ display: 'flex' }}>
                            <div style={{ flexGrow: 1 }}>
                                <SearchResults
                                    items={this.getFilteredComponents()}
                                    selectedItemIndex={selectedItemIndex}
                                    onItemClick={this.handleItemClick}
                                />
                            </div>
                            <div style={{ height: 'auto', flexGrow: 3 }}>
                                <Preview
                                    loading={!this.getPreviewItem()}
                                    item={this.getPreviewItem()}
                                    composite={true}
                                    jsxCode={this.getPreviewItemJsx()}
                                />
                            </div>
                        </div>
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

export default onClickOutside(SearchBox)
