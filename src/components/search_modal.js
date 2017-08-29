import React from 'react'
import Modal from 'node_modules/react-modal/dist/react-modal.js'
import 'src/components/search_modal.css'

export default class SearchModal extends React.Component {
    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    handleKeypress = e => {
        const keyCode = e.keyCode || e.which
        if (keyCode === 27) {
            e.preventDefault()
            this.props.onRequestClose()
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            searchText: ''
        }
        this.searchInputRef = null
    }

    componentWillMount() {
        document.addEventListener('keydown', this.handleKeypress)
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
            <div onKeyDown={this.handleKeypress}>
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
                        onKeyDown={this.handleKeypress}
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
