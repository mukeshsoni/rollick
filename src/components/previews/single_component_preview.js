import React from 'react'
import PropTypes from 'prop-types'
import loadComponentFromPath from '../playground/load_component_from_path.js'
import faker from '../../faker.js'
import iframeWrapper from './iframe_wrapper.js'
import '../styleguide/loader.css'
import { jsxToJs } from '../../tools/transpile_helpers.js'

const JSX_PARSE_ERROR = 'JSX_PARSE_ERROR'
const JSX_EVAL_ERROR = 'JSX_EVAL_ERROR'
const COMPONENT_LOAD_ERROR = 'COMPONENT_LOAD_ERROR'

const errorStrings = {
    [JSX_PARSE_ERROR]: 'Error trying to parse jsx',
    [JSX_EVAL_ERROR]: 'Error evaluating the transpiled jsx',
    [COMPONENT_LOAD_ERROR]: 'Error trying to load the component'
}

function errorSection(errorType, e) {
    return (
        <div>
            <h4 style={{ marginBottom: '1em' }}>
                {errorStrings[errorType] || 'Unknown error'}
            </h4>
            <div>
                {e.toString()}
            </div>
        </div>
    )
}

class SingleComponentPreview extends React.Component {
    lastValidRender: null

    getComponent = item => {
        loadComponentFromPath(item)
            .then(com => {
                window[item.name] = com.component.default || com.component
                this.setState({
                    loading: false,
                    errorLoadingComponent: null,
                    component: com.component,
                    // if item has fakeProps, we want to get those. Since they might have changed from attribute pane or whereever
                    fakeProps: com.fakeProps
                })
            })
            .catch(e => {
                this.setState({
                    loading: false,
                    errorLoadingComponent: e
                })
            })
    }

    getComponentToRender = () => {
        let { jsxCode } = this.props

        if (jsxCode) {
            let jsCode = jsxToJs(jsxCode)

            if (jsCode.error) {
                if (
                    this.lastValidRender &&
                    this.lastValidRender.componentPath === this.props.item.path
                ) {
                    return this.lastValidRender.codeToRender
                } else {
                    console.error('Error transpiling jsx', jsCode.error)
                    return errorSection(JSX_PARSE_ERROR, jsCode.error)
                }
            } else {
                try {
                    let codeToRender = eval(jsxToJs(jsxCode).transpiledCode)
                    this.lastValidRender = {
                        componentPath: this.props.item.path,
                        codeToRender
                    }

                    return codeToRender
                } catch (e) {
                    console.error(
                        'Error evaluating transpiled jsx code. Should not actually happen. ever.',
                        e
                    )
                    if (
                        this.lastValidRender &&
                        this.lastValidRender.componentPath ===
                            this.props.item.path
                    ) {
                        return this.lastValidRender.codeToRender
                    } else {
                        return errorSection(JSX_EVAL_ERROR, e)
                    }
                }
            }
        } else {
            let codeToRender = React.createElement(
                component,
                item.fakeProps ? item.fakeProps : fakeProps
            )

            this.lastValidRender = {
                componentPath: this.props.item.path,
                codeToRender
            }

            return codeToRender
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            component: null,
            fakeProps: {},
            errorLoadingComponent: null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.item !== this.props.item &&
            nextProps.item.path !== this.props.item.path
        ) {
            this.getComponent(nextProps.item)
        }
    }

    componentWillMount() {
        this.getComponent(this.props.item)
    }

    render() {
        const { item, jsxCode, containerClasses } = this.props
        const {
            loading,
            errorLoadingComponent,
            component,
            fakeProps
        } = this.state

        if (!item) {
            return null
        }

        if (loading) {
            return <div className="loader" />
        }

        if (errorLoadingComponent) {
            return errorSection(COMPONENT_LOAD_ERROR, errorLoadingComponent)
        } else {
            return (
                <div>
                    <div
                        style={{
                            padding: 16,
                            borderTop: '2px solid #24B981',
                            borderRadius: 3,
                            marginBottom: 16,
                            paddingTop: 36,
                            paddingBottom: 36
                        }}
                        className={containerClasses}
                    >
                        {this.getComponentToRender()}
                    </div>
                </div>
            )
        }
    }
}

SingleComponentPreview.propTypes = {
    item: PropTypes.object.isRequired,
    style: PropTypes.object,
    cssUrlsToInsert: PropTypes.arrayOf(PropTypes.string),
    jsUrlsToInsert: PropTypes.arrayOf(PropTypes.string),
    jsxCode: PropTypes.string,
    containerClasses: PropTypes.string
}

SingleComponentPreview.defaultProps = {
    style: {},
    cssUrlsToInsert: [],
    jsUrlsToInsert: [],
    containerClasses: ''
}

export default iframeWrapper(SingleComponentPreview)
