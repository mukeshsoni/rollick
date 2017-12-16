import React from 'react'
import FileSaver from 'file-saver'
import SearchInput from '../search_box/search_input.js'
import '../search_box/search_box.css'
import './styleguide.css'
import './loader.css'
import { getComponent, getComponentElement } from './component_maker.js'
import { enhanceComponent } from '../../tools/component_loaders.js'
import faker from '../../faker.js'
import AttributePane from './attribute_pane/index.js'
import debounce from 'debounce'
// import { getProp } from 'jsx-ast-utils'
import * as babylon from 'babylon'
import traverse from 'babel-traverse'
import * as t from 'babel-types'
window.t = t

import {
    getPropValue,
    populateDefaultValues
} from '../../component_maker_helpers/prop_value_from_string.js'
import looseFilter from '../../tools/loose_filter.js'
import StyleguidePlayground from './styleguide_playground.js'
import { formatCode } from '../../tools/code_formatter.js'
import {
    componentJsx,
    jsxToJs,
    transpile
} from '../../tools/transpile_helpers.js'
import {
    saveProps,
    getSavedProps,
    getSavedStories,
    saveStories,
    getAllSavedComponentsData,
    saveAllComponentsData
} from '../../persist.js'
import { getPropsFromJsxCode } from '../../tools/jsx_utils.js'

const code = `<div width={100}>abc</div>`

function updatePropAtIndex(propName, index, propValue, arr) {
    return arr.map((item, i) => {
        if (i === index) {
            return {
                ...item,
                [propName]: propValue
            }
        } else {
            return item
        }
    })
}

const updateJsxCodeInStory = updatePropAtIndex.bind(null, 'jsxCode')

// const ast = transpile(code).ast
// const ast = babylon.parse(code, { plugins: ['jsx'] })
// const jsxCode =
//     '<Button \
//   label={"labellkkjasdfdsaf"} \
//   onClick={function fakeFunction() {}} \
//   style={{}} \
//   enabled={true} \
// />'

// traverse(babylon.parse(jsxCode, { plugins: ['jsx'] }), {
//     JSXOpeningElement(path) {
//         console.log('got a jsx element', path)
//     }
// })

// traverse(ast, {
//     JSXOpeningElement: node => {
//         // debugger
//         console.log(
//             'got jsx element',
//             node,
//         )
//     }
// })

export default class Styleguide extends React.Component {
    handleDeleteStory = storyIndex => {
        let { selectedComponent } = this.state
        if (!selectedComponent || !selectedComponent.stories) {
            return
        }

        let confirmation = window.confirm(
            'Are you sure you want to delete this story?'
        )

        if (confirmation === true) {
            this.setState(
                {
                    selectedComponent: {
                        ...selectedComponent,
                        stories: selectedComponent.stories.filter(
                            (story, index) => index !== storyIndex
                        )
                    }
                },
                () => {
                    saveStories(
                        this.state.selectedComponent.path,
                        this.state.selectedComponent.stories
                    )
                }
            )
        }
    }

    handleExportPropsClick = e => {
        // TODO - the export should export saved props/jsx for all components
        if (this.state.selectedComponent) {
            var blob = new Blob(
                [JSON.stringify(getAllSavedComponentsData(), null, 2)],
                {
                    type: 'text/plain;charset=utf-8'
                }
            )
            FileSaver.saveAs(blob, 'rollick-saved-props.json')
        }
    }

    handleStoryTitleChange = (index, newTitle) => {
        this.setState(
            {
                selectedComponent: {
                    ...this.state.selectedComponent,
                    stories: updatePropAtIndex(
                        'title',
                        index,
                        newTitle,
                        this.state.selectedComponent.stories
                    )
                }
            },
            () => {
                saveStories(
                    this.state.selectedComponent.path,
                    this.state.selectedComponent.stories
                )
            }
        )
    }

    handleImportPropsClick = e => {
        document.getElementById('import-component-data').click()
    }

    importComponentData = () => {
        var file = e.target.files[0]
        if (!file) {
            return
        }

        var reader = new FileReader()
        reader.onload = e => {
            try {
                const componentsData = JSON.parse(e.target.result)
                saveAllComponentsData(componentsData)
            } catch (e) {
                console.error('could not parse json', e)
            }
        }

        reader.readAsText(file)
    }

    handleEditorFocusChange = focus => {
        // setTimeout(() => {
        //     this.setState({
        //         showPropertiesPane: focus || this.state.showPropertiesPane
        //     })
        // }, 500)
    }

    // for now saving the whole jsx string and loading it back during mount. Easy peasy.
    // TODO - should not allow props/jsx saving if the jsx is invalid
    // One problem with just saving the jsx might be that when user adds component from styleguide
    // to the playground, the props will not be what's shown in the jsxCode
    // TODO - Maybe, just get the jsx props when the user adds the component to the playground.
    // Don't need to do it all the time
    // 2. Another case when we want the props is when there is a properties pane
    handleSavePropsClick = storyIndex => {
        // saveProps(
        //     this.state.selectedComponent.path,
        //     this.state.selectedComponent.fakeProps
        // )
        saveStories(
            this.state.selectedComponent.path,
            this.state.selectedComponent.stories
        )
        this.setState(
            {
                selectedComponent: {
                    ...this.state.selectedComponent,
                    stories: updatePropAtIndex(
                        'savingProps',
                        storyIndex,
                        true,
                        this.state.selectedComponent.stories
                    )
                }
            },
            () => {
                setTimeout(() => {
                    this.setState({
                        selectedComponent: {
                            ...this.state.selectedComponent,
                            stories: updatePropAtIndex(
                                'savingProps',
                                storyIndex,
                                false,
                                this.state.selectedComponent.stories
                            )
                        }
                    })
                }, 1000)
            }
        )
    }

    handleFormatCodeClick = storyIndex => {
        // let { selectedComponent } = this.state

        // let formattedCode = formatCode(componentJsx(selectedComponent), {
        //     line: 0,
        //     ch: 0
        // }).formattedCode.slice(1)
        let formattedCode = formatCode(
            this.state.selectedComponent.stories[storyIndex].jsxCode,
            { line: 0, ch: 0 }
        )

        if (formattedCode.error) {
            console.error('error formatting jsx - ', formattedCode.error)
        } else {
            this.setState({
                selectedComponent: {
                    ...this.state.selectedComponent,
                    stories: updateJsxCodeInStory(
                        storyIndex,
                        formattedCode.formattedCode.slice(1),
                        this.state.selectedComponent.stories
                    )
                }
            })
        }
    }

    // TODO - probably need to state variables for selectedComponent. One will have the dirty/invalid state.
    // Another one will sync whenever the first one gets into valid state again and is sent to the preview component.
    handleJsxCodeChange = (storyIndex, newCode) => {
        let propsFromChangedCode =
            getPropsFromJsxCode(newCode) ||
            this.state.selectedComponent.fakeProps

        this.setState({
            selectedComponent: {
                ...this.state.selectedComponent,
                fakeProps: {
                    ...this.state.selectedComponent.fakeProps,
                    ...propsFromChangedCode
                },
                stories: updateJsxCodeInStory(
                    storyIndex,
                    newCode,
                    this.state.selectedComponent.stories
                )
            }
        })
    }

    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    handleAddComponent = index => {
        this.props.onAddComponent(
            this.state.selectedComponent,
            this.state.selectedComponent.stories[index].jsxCode
        )
    }

    handleAddStory = story => {
        let { selectedComponent } = this.state

        if (!selectedComponent) {
            return
        }

        this.setState({
            selectedComponent: {
                ...selectedComponent,
                stories: selectedComponent.stories.concat(
                    selectedComponent.stories[
                        selectedComponent.stories.length - 1
                    ]
                )
            }
        })
    }

    handleAttributeValueChange = (propName, value) => {
        const { selectedComponent } = this.state
        const newSelectedComponent = {
            ...selectedComponent,
            fakeProps: {
                ...selectedComponent.fakeProps,
                [propName]: value
            }
        }
        let formattedCode = formatCode(componentJsx(newSelectedComponent), {
            line: 0,
            ch: 0
        }).formattedCode.slice(1)

        if (selectedComponent) {
            this.setState({
                selectedComponent: {
                    ...newSelectedComponent,
                    stories: updateJsxCodeInStory(
                        0,
                        formattedCode,
                        selectedComponent.stories
                    )
                }
            })
        }
    }

    handleComponentItemClick = debounce(com => {
        this.setState({
            selectedComponent: enhanceComponent(com)
            // showPropertiesPane:
            //     this.state.selectedComponent &&
            //     com.path === this.state.selectedComponent.path
        })
    }, 300)

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
            componentsMetaListSorted: [],
            showPropertiesPane: false,
            activeStoryIndex: 0
        }
    }

    componentWillMount() {
        SystemJS.import('components.meta.json!json').then(meta => {
            this.setState(
                {
                    componentsMetaList: meta,
                    componentsMetaListSorted: meta.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    )
                },
                // TODO - remove this section. It's a hack while testing styleguide with some component selected,
                // so that i don't have to click on the button component 1 billion times
                () => {
                    this.handleComponentItemClick(
                        this.state.componentsMetaListSorted[3]
                    )
                }
            )
        })
    }

    componentDidMount() {
        this.searchInputRef && this.searchInputRef.getInputRef().focus()
    }

    render() {
        const {
            searchText,
            selectedComponent,
            selectedComponentInstance,
            showPropertiesPane
        } = this.state

        const leftPaneStyle = {
            flex: 1,
            padding: '1em'
            // borderRight: '1px solid rgba(200, 200, 200, 0.9)'
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
                    <div>{this.getComponentList()}</div>
                </div>
                <div className="styleguide-body">
                    <StyleguidePlayground
                        onDeleteStory={this.handleDeleteStory}
                        onAddComponent={this.handleAddComponent}
                        onAddStory={this.handleAddStory}
                        item={selectedComponent}
                        onCodeChange={this.handleJsxCodeChange}
                        onEditorFocusChange={this.handleEditorFocusChange}
                        onSavePropClick={this.handleSavePropsClick}
                        onFormatCodeClick={this.handleFormatCodeClick}
                        onImportPropsClick={this.handleImportPropsClick}
                        onExportSavedPropsClick={this.handleExportPropsClick}
                        onStoryTitleChange={this.handleStoryTitleChange}
                    />
                </div>
                {selectedComponent &&
                    showPropertiesPane && (
                        <AttributePane
                            component={this.state.selectedComponent}
                            onChange={this.handleAttributeValueChange}
                        />
                    )}
                <input
                    type="file"
                    id="import-component-data"
                    style={{ display: 'none' }}
                    onChange={this.importComponentData}
                />
            </div>
        )
    }
}

Styleguide.propTypes = {
    onAddComponent: React.PropTypes.func
}
