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
    }

    render() {
        const { onRequestClose } = this.props
        const { searchText } = this.state

        const modalStyle = {
            content: {
                top: '20%'
            }
        }

        return (
            <div>
                <Modal
                    isOpen={true}
                    onAfterOpen={() => {}}
                    onRequestClose={onRequestClose}
                    style={modalStyle}
                    contentLabel="Search Components"
                >
                    <input
                        className="search-modal-input"
                        value={searchText}
                        onChange={this.handleInputChange}
                    />
                </Modal>
            </div>
        )
    }
}
