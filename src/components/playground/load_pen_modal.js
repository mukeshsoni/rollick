import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'node_modules/react-modal/dist/react-modal.js'
import SearchInput from '../search_box/search_input.js'
import SavedPenList from './saved_pen_list.js'

export default class LoadPenModal extends React.Component {
    searchInputRef = null

    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    constructor(props) {
        super(props)

        this.state = {
            searchText: ''
        }
    }

    render() {
        let { searchText } = this.state
        let styleguideModalStyle = {
            overlay: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.9)',
                zIndex: 25
            },
            content: {
                left: '30%',
                right: '30%'
            }
        }

        return (
            <Modal
                isOpen={true}
                onRequestClose={this.props.onClose}
                closeTimeoutMS={200}
                style={styleguideModalStyle}
                contentLabel="Load saved pen"
            >
                <SearchInput
                    ref={node => (this.searchInputRef = node)}
                    className={'search-modal-input'}
                    value={searchText}
                    onChange={this.handleInputChange}
                    placeholder="Search saved pen"
                    autoFocus={true}
                />
                <SavedPenList
                    filter={searchText}
                    onSelect={this.props.onSelect}
                />
            </Modal>
        )
    }
}

LoadPenModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
}
