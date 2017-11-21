import React from 'react'
import PropTypes from 'prop-types'

import PropsAndMethods from '../previews/props_and_methods.js'
import PreviewCodeSection from '../previews/preview_code_section.js'
import SingleComponentPreview from '../previews/single_component_preview.js'
import { componentJsx } from '../playground/transpile_helpers.js'
import { formatCode } from '../playground/code_formatter.js'

class StyleguidePlayground extends React.Component {
    handleJsxCodeChange = newCode => {
        this.setState({
            jsxCode: newCode
        })
    }

    constructor(props) {
        super(props)

        let { item } = this.props
        let formattedCode = item
            ? formatCode(componentJsx(item), {
                  line: 0,
                  ch: 0
              }).formattedCode.slice(1)
            : ''

        this.state = {
            jsxCode: formattedCode
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.item !== nextProps.item) {
            let { item } = nextProps
            let formattedCode = item
                ? formatCode(componentJsx(item), {
                      line: 0,
                      ch: 0
                  }).formattedCode.slice(1)
                : ''

            this.state = {
                jsxCode: formattedCode
            }
        }
    }

    render() {
        let { item, onAddComponent } = this.props
        let jsUrlsToInsert = [
            'jspm_packages/npm/codemirror@5.31.0/mode/jsx/jsx.js'
        ]

        let cssUrlsToInsert = [
            'node_modules/codemirror/lib/codemirror.css',
            'node_modules/codemirror/theme/base16-light.css'
        ]
        let cssToInsertInIframe = '.ReactCodeMirror .CodeMirror {height: 100%}'

        const bodyStyle = {
            flex: 4,
            padding: '1em'
        }
        let { jsxCode } = this.state
        // let formattedCode = formatCode(componentJsx(item), {
        //     line: 0,
        //     ch: 0
        // }).formattedCode.slice(1)

        return (
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
                    <a
                        style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: 'blue'
                        }}
                        onClick={onAddComponent}
                    >
                        Add this
                    </a>
                </div>
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
                <div style={{ height: 'auto' }}>
                    <SingleComponentPreview
                        jsUrlsToInsert={jsUrlsToInsert}
                        cssUrlsToInsert={cssUrlsToInsert}
                        cssToInsert={cssToInsertInIframe}
                        item={item}
                        jsxCode={jsxCode}
                    />
                </div>
                <div style={{ marginBottom: 32 }}>
                    <PreviewCodeSection
                        onCodeChange={this.handleJsxCodeChange}
                        item={item}
                        jsxCode={jsxCode}
                    />
                </div>
                <div style={{ marginBottom: 32 }}>
                    <PropsAndMethods item={item} />
                </div>
            </div>
        )
    }
}

StyleguidePlayground.propTypes = {
    item: PropTypes.object.isRequired,
    onAddComponent: PropTypes.func.isRequired
}

export default StyleguidePlayground
