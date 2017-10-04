import React from 'react'
import SearchInput from '../search_box/search_input.js'
import '../search_box/search_box.css'
import './styleguide.css'
import './loader.css'
import { getComponent, getComponentElement } from './component_maker.js'
import faker from '../../faker.js'
import AttributePane from './attribute_pane/index.js'
import debounce from 'debounce'
import {
    getPropValue,
    populateDefaultValues
} from '../../component_maker_helpers/prop_value_from_string.js'
import looseFilter from '../../tools/loose_filter.js'
import SingleComponentPreview from '../previews/single_component_preview.js'

export default class Styleguide extends React.Component {
    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    handleAddComponent = () => {
        this.props.onAddComponent(this.state.selectedComponent)
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
        this.setState({
            selectedComponent: {
                ...com,
                fakeProps: faker(com.props, { optional: true })
            }
        })
    }, 500)

    getFiltedredComponentList = () => {
        const { searchText } = this.state

        if (searchText.trim() === '') {
            return this.state.componentsMetaListSorted
        } else {
            return looseFilter(
                this.state.componentsMetaListSorted,
                'name',
                searchText
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
                    key={`styleguide_list_item_${com.path}`}
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
            componentsMetaListSorted: []
        }
    }

    componentWillMount() {
        SystemJS.import('components.meta.json!json').then(meta => {
            this.setState({
                componentsMetaList: meta,
                componentsMetaListSorted: meta.sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
            })
        })
    }

    componentDidMount() {
        this.searchInputRef && this.searchInputRef.getInputRef().focus()
    }

    render() {
        const {
            searchText,
            selectedComponent,
            selectedComponentInstance
        } = this.state

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
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <h3
                            style={{
                                paddingBottom: '0.5em'
                            }}
                        >
                            Preview
                        </h3>
                        {this.state.selectedComponent
                            ? <a
                                  style={{
                                      cursor: 'pointer',
                                      fontWeight: 'bold',
                                      color: 'blue'
                                  }}
                                  onClick={this.handleAddComponent}
                              >
                                  Add this
                              </a>
                            : null}
                    </div>
                    {this.state.selectedComponent &&
                        <div style={{ padding: '2em' }}>
                            <SingleComponentPreview item={selectedComponent} />
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

Styleguide.propTypes = {
    onAddComponent: React.PropTypes.func
}
