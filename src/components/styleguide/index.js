import React from 'react'
import SearchInput from '../search_box/search_input.js'
import '../search_box/search_box.css'
import './styleguide.css'
import './loader.css'
import { getComponent, getComponentElement } from './component_maker.js'
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
import { formatCode } from '../playground/code_formatter.js'
import { componentJsx } from '../playground/transpile_helpers.js'
import { jsxToJs, transpile } from '../playground/transpile_helpers.js'

const code = `<div width={100}>abc</div>`

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

function getPropsFromJsxCode(oldFakeProps, jsxCode) {
    let newFakeProps = { ...oldFakeProps }
    let transpiledCode = transpile(jsxCode)

    if (transpiledCode.error) {
        return oldFakeProps
    } else {
        // let ast = babylon.parse(jsxCode, { plugins: ['jsx'] })
        let ast = transpiledCode.ast

        // traverse(babylon.parse(jsxCode, { plugins: ['jsx'] }), {
        //     JSXOpeningElement(node) {
        //         console.log('got a jsx element', node)
        //     }
        // })

        let propsInAst = ast.program.body[0].expression.arguments[1].properties

        propsInAst.forEach(propInAst => {
            if (propInAst && propInAst.value && propInAst.value.value) {
                newFakeProps[propInAst.key.name] = propInAst.value.value
            }
        })

        return newFakeProps
    }
}

export default class Styleguide extends React.Component {
    handleEditorFocusChange = focus => {
        // setTimeout(() => {
        //     this.setState({
        //         showPropertiesPane: focus || this.state.showPropertiesPane
        //     })
        // }, 500)
    }

    // TODO - probably need to state variables for selectedComponent. One will have the dirty/invalid state.
    // Another one will sync whenever the first one gets into valid state again and is sent to the preview component.
    handleJsxCodeChange = newCode => {
        this.setState({
            selectedComponent: {
                ...this.state.selectedComponent,
                fakeProps: {
                    ...this.state.selectedComponent.fakeProps,
                    ...getPropsFromJsxCode(
                        this.state.selectedComponent.fakeProps,
                        newCode
                    )
                }
            },
            jsxCode: newCode
        })
    }

    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    handleAddComponent = () => {
        this.props.onAddComponent(this.state.selectedComponent)
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
                selectedComponent: newSelectedComponent,
                jsxCode: formattedCode
            })
        }
    }

    handleComponentItemClick = debounce(com => {
        const newSelectedComponent = {
            ...com,
            fakeProps: faker(com.props, { optional: true })
        }
        let formattedCode = formatCode(componentJsx(newSelectedComponent), {
            line: 0,
            ch: 0
        }).formattedCode.slice(1)

        this.setState({
            selectedComponent: newSelectedComponent,
            jsxCode: formattedCode,
            showPropertiesPane:
                this.state.selectedComponent &&
                com.path === this.state.selectedComponent.path
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
            showPropertiesPane: false
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
                    <div>
                        {this.getComponentList()}
                    </div>
                </div>
                <div className="styleguide-body">
                    <StyleguidePlayground
                        onAddComponent={this.handleAddComponent}
                        item={selectedComponent}
                        jsxCode={this.state.jsxCode}
                        onCodeChange={this.handleJsxCodeChange}
                        onEditorFocusChange={this.handleEditorFocusChange}
                    />
                </div>
                {selectedComponent &&
                    showPropertiesPane &&
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
