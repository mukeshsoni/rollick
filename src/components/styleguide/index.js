import React from 'react'
import SearchInput from '../search_box/search_input.js'
import '../search_box/search_box.css'
import './styleguide.css'
import './loader.css'
import componentsMetaList from 'components.meta.json!json'
import { getComponent, getComponentElement } from './component_maker.js'
import faker from '../../faker.js'
import AttributePane from './attribute_pane.js'
import debounce from 'debounce'
import {
    getPropValue,
    populateDefaultValues
} from './prop_value_from_string.js'

export default class Styleguide extends React.Component {
    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    getComponentPreview = () => {
        const { selectedComponent, selectedComponentInstance } = this.state

        if (!selectedComponentInstance) {
            return null
        } else {
            return (
                <div>
                    {React.createElement(
                        selectedComponentInstance,
                        selectedComponent.fakeProps
                    )}
                </div>
            )
        }
    }

    handleAttributeValueChange = (propName, value) => {
        const { selectedComponent } = this.state

        if (selectedComponent) {
            this.setState({
                selectedComponent: {
                    ...selectedComponent,
                    fakeProps: {
                        ...selectedComponent.fakeProps,
                        [propName]: getPropValue(
                            selectedComponent.props[propName],
                            value
                        )
                    }
                }
            })
        }
    }

    handleComponentItemClick = debounce(com => {
        this.setState({ loadingComponent: true })
        getComponent(com)
            .then(component =>
                this.setState({
                    loadingComponent: false,
                    selectedComponent: {
                        ...com,
                        fakeProps: populateDefaultValues(
                            com.props,
                            faker(com.props)
                        )
                    },
                    selectedComponentInstance: component
                })
            )
            .catch(e => this.setState({ loadingComponent: false }))
    }, 500)

    getFiltedredComponentList = () => {
        const { searchText } = this.state

        if (searchText.trim() === '') {
            return componentsMetaList
        } else {
            return componentsMetaList.filter(
                item =>
                    item.name
                        .toLowerCase()
                        .indexOf(searchText.toLowerCase().trim()) >= 0
            )
        }
    }

    getComponentList = () => {
        const itemStyle = {
            paddingBottom: '1em'
        }
        return this.getFiltedredComponentList().map(com => {
            let className = 'styleguide-list-item'

            if (
                this.state.selectedComponent &&
                this.state.selectedComponent.path === com.path
            ) {
                className += ' selected'
            }

            return (
                <div
                    className={className}
                    onClick={this.handleComponentItemClick.bind(this, com)}
                    key={`styleguide_list_item_${com.name}`}
                >
                    {com.name}
                </div>
            )
        })
    }

    constructor(props) {
        super(props)

        this.state = {
            searchText: '',
            selectedComponent: null,
            selectedComponentInstance: null,
            loadingComponent: false
        }
    }

    componentDidMount() {
        this.searchInputRef && this.searchInputRef.getInputRef().focus()
    }

    render() {
        const { searchText } = this.state

        const leftPaneStyle = {
            flex: 1,
            padding: '1em',
            borderRight: '1px solid rgba(200, 200, 200, 0.9)'
        }

        const bodyStyle = {
            flex: 4,
            padding: '1em'
        }

        return (
            <div className="styleguide-container">
                <div className="styleguide-list" style={leftPaneStyle}>
                    <SearchInput
                        ref={node => (this.searchInputRef = node)}
                        className={'search-modal-input'}
                        value={searchText}
                        onChange={this.handleInputChange}
                        placeholder="Search Component"
                    />
                    <div>
                        {this.getComponentList()}
                    </div>
                </div>
                <div className="styleguide-body" style={bodyStyle}>
                    <div>
                        <h3
                            style={{
                                paddingBottom: '0.5em',
                                borderBottom: '1px solid rgba(200,200,200,0.9)'
                            }}
                        >
                            Preview
                        </h3>
                    </div>
                    {this.state.loadingComponent
                        ? <div className="loader">Loading...</div>
                        : <div style={{ padding: '2em' }}>
                              {this.getComponentPreview()}
                          </div>}
                </div>
                {this.state.selectedComponent &&
                    <AttributePane
                        component={this.state.selectedComponent}
                        onChange={this.handleAttributeValueChange}
                    />}
            </div>
        )
    }
}
