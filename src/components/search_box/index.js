import React from 'react'
import PropTypes from 'prop-types'
import SearchResults from './search_results'
import SearchInput from './search_input'
import Preview from '../previews/single_component_preview.js'
import classnames from 'classnames'
import onClickOutside from 'react-onclickoutside'
import deboune from 'debounce'
import key from 'keymaster'
import looseFilter from '../../tools/loose_filter.js'
import './search_box.css'

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
        this.props.onSelection(item)
    }

    handleEscKey = e => {
        stopAllPropagations(e)
        this.setState({ searchText: '', selectedItemIndex: -1 })
        this.props.onRequestClose()
    }

    handleRightKey = e => {
        if (this.state.selectedItemIndex >= 0) {
            this.showPreview(
                this.getFilteredComponents()[this.state.selectedItemIndex]
            )
        }
    }

    handleLeftKey = e => {
        if (this.state.selectedItemIndex >= 0 && this.state.previewItem) {
            this.hidePreview()
        }
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
            this.setState({ searchText: '', selectedItemIndex: 0 })
            this.props.onSelection(
                this.getFilteredComponents()[this.state.selectedItemIndex]
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

    showPreview = item => {
        this.setState({ previewItem: item })
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
                style={{ width: 300 }}
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

    componentDidMount() {
        key('esc', this.handleEscKey)
        key('right', this.handleRightKey)
        key('left', this.handleLeftKey)
        key('down', this.handleDownKey)
        key('up', this.handleUpKey)
        key('enter', this.handleEnterKey)
    }

    render() {
        const { onRequestClose, isOpen } = this.props
        const { selectedItemIndex, previewItem } = this.state

        const searchBoxWidth = 300

        return (
            <div style={{ width: '100%' }}>
                {this.getInput()}
                {this.getFilteredComponents().length > 0 &&
                    <div style={{ display: 'flex', width: searchBoxWidth * 2 }}>
                        <div style={{ width: searchBoxWidth, zIndex: 1000 }}>
                            <SearchResults
                                items={this.getFilteredComponents()}
                                selectedItemIndex={selectedItemIndex}
                                previewItemIndex={this.getPreviewComponentIndex()}
                                onItemClick={this.handleItemClick}
                                onShowPreviewClick={this.handleShowPreviewClick}
                            />
                        </div>
                        <div style={{ width: searchBoxWidth, height: 500 }}>
                            {previewItem &&
                                <Preview
                                    item={previewItem}
                                    style={{
                                        background: 'cadetblue',
                                        height: '100%',
                                        marginLeft: 10,
                                        padding: '1em'
                                    }}
                                />}
                        </div>
                    </div>}
            </div>
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
