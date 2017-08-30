import React from 'react'
import Modal from 'node_modules/react-modal/dist/react-modal.js'
import meta from 'components.meta.json!json'
import SearchResults from './search_results'
import classnames from 'classnames'
import deboune from 'debounce'
import 'src/components/search_modal.css'

console.log('meta about components', meta)

export default class SearchModal extends React.Component {
    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    handleKeypress = e => {
        const keyCode = e.keyCode || e.which
        switch (keyCode) {
            case 13: // enter key
                if (this.state.selectedItemIndex >= 0) {
                    e.nativeEvent.stopImmediatePropagation()
                    e.preventDefault()
                    e.stopPropagation()
                    this.props.onSelection(
                        this.getFilteredComponents()[
                            this.state.selectedItemIndex
                        ]
                    )
                }
                break
            case 27: // esc key
                e.nativeEvent.stopImmediatePropagation()
                e.preventDefault()
                e.stopPropagation()
                this.props.onRequestClose()
                break
            case 40: // down arrow
                e.nativeEvent.stopImmediatePropagation()
                e.preventDefault()
                e.stopPropagation()
                this.setState(
                    {
                        selectedItemIndex:
                            (this.state.selectedItemIndex + 1) %
                            this.getFilteredComponents().length
                    },
                    () =>
                        console.log(
                            'next selected index',
                            this.state.selectedItemIndex
                        )
                )
                break
            case 38: // up arrow
                e.nativeEvent.stopImmediatePropagation()
                e.preventDefault()
                e.stopPropagation()
                this.setState(
                    {
                        selectedItemIndex:
                            (this.getFilteredComponents().length +
                                this.state.selectedItemIndex -
                                1) %
                            this.getFilteredComponents().length
                    },
                    () =>
                        console.log(
                            'next selected index',
                            this.state.selectedItemIndex
                        )
                )
                break
        }
    }

    getFilteredComponents = () => {
        const { searchText } = this.state

        if (searchText.trim() === '') {
            return []
        } else {
            return Object.keys(meta)
                .map(comPath => ({
                    ...meta[comPath],
                    path: comPath,
                    name: comPath
                }))
                .filter(com => com.name.indexOf(searchText.trim()) >= 0)
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            searchText: '',
            selectedItemIndex: -1
        }
        this.searchInputRef = null
    }

    render() {
        const { onRequestClose } = this.props
        const { searchText, selectedItemIndex } = this.state

        const modalStyle = {
            content: {
                top: '20%',
                left: 'calc((100vw - 500px)/2)',
                width: 500,
                border: 'none',
                background: 'none'
            }
        }

        const inputClassnames = classnames('search-modal-input', {
            'with-results': this.getFilteredComponents().length > 0
        })

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
                        onKeyDown={this.handleKeypress}
                        className={inputClassnames}
                        value={searchText}
                        onChange={this.handleInputChange}
                        placeholder="Search Component"
                    />
                    <SearchResults
                        items={this.getFilteredComponents()}
                        selectedItemIndex={selectedItemIndex}
                    />
                </Modal>
            </div>
        )
    }
}
