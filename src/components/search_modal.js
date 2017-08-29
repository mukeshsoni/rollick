import React from 'react'
import Modal from 'node_modules/react-modal/dist/react-modal.js'
import 'src/components/search_modal.css'

export default class SearchModal extends React.Component {
    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    constructor(props) {
        super(props)

        this.state = {
            searchText: ''
        }
        this.searchInputRef = null
    }

    render() {
        const { onRequestClose } = this.props
        const { searchText } = this.state

        const modalStyle = {
            content: {
                top: '20%',
                left: 'calc((100vw - 500px)/2)',
                width: 500,
                border: 'none',
                background: 'none'
            }
        }

        return (
            <div>
                <Modal
                    isOpen={true}
                    onAfterOpen={() => {
                        this.searchInputRef && this.searchInputRef.focus()
                    }}
                    onRequestClose={onRequestClose}
                    style={modalStyle}
                    contentLabel="Search Components"
                >
                    <input
                        ref={input => (this.searchInputRef = input)}
                        className="search-modal-input"
                        value={searchText}
                        onChange={this.handleInputChange}
                        placeholder="Search Component"
                    />
                </Modal>
            </div>
        )
    }
}
