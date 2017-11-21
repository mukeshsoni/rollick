import React from 'react'
import PropTypes from 'prop-types'
import loadComponentFromPath from '../playground/load_component_from_path.js'
import faker from '../../faker.js'
import iframeWrapper from './iframe_wrapper.js'
import PropsAndMethods from './props_and_methods.js'
import PreviewCodeSection from './preview_code_section.js'
import '../styleguide/loader.css'

class SingleComponentPreview extends React.Component {
    getComponent = item => {
        loadComponentFromPath(item)
            .then(com => {
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
        const { item } = this.props
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
                    <header style={{ marginBottom: 24 }}>
                        <h2 style={{ marginBottom: 8 }}>
                            {item.name}
                        </h2>
                        <div
                            style={{
                                fontSize: '0.9em',
                                color: '#999'
                            }}
                        >
                            {item.path}
                            <button
                                type="button"
                                title="Copy to clipboard"
                                style={{
                                    background: 'transparent',
                                    transition: 'color 750ms ease-out',
                                    color: '#999',
                                    padding: 2,
                                    marginLeft: 4,
                                    cursor: 'pointer'
                                }}
                            >
                                <svg
                                    fill="currentColor"
                                    preserveAspectRatio="xMidYMid meet"
                                    height="1em"
                                    width="1em"
                                    viewBox="0 0 40 40"
                                    style={{ verticalAlign: 'middle' }}
                                >
                                    <g>
                                        <path d="m31.6 35v-23.4h-18.2v23.4h18.2z m0-26.6c1.8 0 3.4 1.4 3.4 3.2v23.4c0 1.8-1.6 3.4-3.4 3.4h-18.2c-1.8 0-3.4-1.6-3.4-3.4v-23.4c0-1.8 1.6-3.2 3.4-3.2h18.2z m-5-6.8v3.4h-20v23.4h-3.2v-23.4c0-1.8 1.4-3.4 3.2-3.4h20z" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </header>
                    {item.description &&
                        <div style={{ marginBottom: 8 }}>
                            {item.description}
                        </div>}
                    <div
                        style={{
                            padding: 16,
                            border: '1px solid #e8e8e8',
                            borderRadius: 3,
                            marginBottom: 32
                        }}
                    >
                        {React.createElement(
                            component,
                            item.fakeProps ? item.fakeProps : fakeProps
                        )}
                    </div>
                    <div style={{ marginBottom: 32 }}>
                        <PreviewCodeSection item={item} />
                    </div>
                    <div style={{ marginBottom: 32 }}>
                        <PropsAndMethods item={item} />
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
    jsUrlsToInsert: PropTypes.arrayOf(PropTypes.string)
}

SingleComponentPreview.defaultProps = {
    style: {},
    cssUrlsToInsert: [],
    jsUrlsToInsert: []
}

export default iframeWrapper(SingleComponentPreview)
