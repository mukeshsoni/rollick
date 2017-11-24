// @flow
import React from 'react'
import PropTypes from 'prop-types'
import loadComponentFromPath from '../playground/load_component_from_path.js'
import faker from '../../faker.js'
import iframeWrapper from './iframe_wrapper.js'
import '../styleguide/loader.css'
import { jsxToJs } from '../playground/transpile_helpers.js'

type NewStuff = 'a' | 'b'

function errorSection(e) {
    return (
        <div>
            <h4>Error loading jsx</h4>
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
                    error: null,
                    component: com.component,
                    // if item has fakeProps, we want to get those. Since they might have changed from attribute pane or whereever
                    fakeProps: com.fakeProps
                })
            })
            .catch(e => {
                this.setState({
                    loading: false,
                    error: e
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
                    return errorSection(jsCode.error)
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
                    if (
                        this.lastValidRender &&
                        this.lastValidRender.componentPath ===
                            this.props.item.path
                    ) {
                        return this.lastValidRender.codeToRender
                    } else {
                        return errorSection(jsCode.error)
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
            error: null
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
        const { item, jsxCode } = this.props
        const { loading, error, component, fakeProps } = this.state

        if (!item) {
            return null
        }

        if (loading) {
            return <div className="loader" />
        }

        if (error) {
            return (
                <div>
                    <h4>Error loading component</h4>
                    <div>
                        {error}
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div
                        style={{
                            padding: 16,
                            borderTop: '2px solid #24B981',
                            borderBottom: '2px solid #24B981',
                            borderRadius: 3,
                            marginBottom: 16,
                            paddingTop: 36,
                            paddingBottom: 36
                        }}
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
    jsxCode: PropTypes.string
}

SingleComponentPreview.defaultProps = {
    style: {},
    cssUrlsToInsert: [],
    jsUrlsToInsert: []
}

export default iframeWrapper(SingleComponentPreview)
