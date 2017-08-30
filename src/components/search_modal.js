import React from 'react'
import Modal from 'node_modules/react-modal/dist/react-modal.js'
import meta from 'components.meta.json!json'
import SearchResults from './search_results'
import 'src/components/search_modal.css'

console.log('meta about components', meta)

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

    getFilteredComponents = () => {
        const { searchText } = this.state

        if (searchText.trim() === '') {
            return []
        } else {
            return Object.keys(meta)
                .map(comPath => ({ ...meta[comPath], name: comPath }))
                .filter(com => com.name.indexOf(searchText.trim()) >= 0)
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
                    <SearchResults items={this.getFilteredComponents()} />
                </Modal>
            </div>
        )
    }
}
