/*
  * HOC which wraps children in iframe
  * And injects newly added css (to head tag in main frame) to the iframe
  */
import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'react-frame-component'
import cssObserver from './css_observer.js'

export default function iframeWrapper(WrappedComponent) {
    class IframeWrapperComponent extends React.Component {
        getIframeHead() {
            return (
                <div>
                    <style>
                        {this.props.cssToInsertInIframe &&
                            this.props.cssToInsertInIframe.length &&
                            this.props.cssToInsertInIframe.join('\n')}
                        {this.props.cssToInsert || ''}
                        {'* {margin: 0;}'}
                        {
                            '.CodeMirror-code: {font-family: Fira Code Light; line-height: 1.2}'
                        }
                        {
                            '.cm-s-base16-light span.cm-property, .cm-s-base16-light span.cm-attribute { font-family: Consolas, "Liberation Mono", Menlo, monospace; line-height: 1.5}'
                        }
                    </style>
                    {this.state.cssFilesToInject
                        .concat(this.props.cssUrlsToInsert)
                        .map(cssFilePath => {
                            return (
                                <link
                                    key={'link_tag_' + cssFilePath}
                                    type="text/css"
                                    rel="stylesheet"
                                    href={cssFilePath}
                                />
                            )
                        })}
                    {this.props.jsUrlsToInsert.map(scriptPath => {
                        return (
                            <script
                                key={'iframe_head_script_' + scriptPath}
                                type="text/javascript"
                                src={scriptPath}
                            />
                        )
                    })}
                </div>
            )
        }

        globalCssLinks = () => {
            // get global css which user wants to inject to all preview panes. In our case, the iframes
            SystemJS.import('/rollick.config.js').then(config => {
                if (
                    config.globals &&
                    config.globals.css &&
                    config.globals.css.urls
                ) {
                    this.setState({
                        cssFilesToInject: this.state.cssFilesToInject.concat(
                            config.globals.css.urls
                        )
                    })
                }
            })
        }

        constructor(props) {
            super(props)

            this.state = {
                cssToInsertInIframe: [],
                cssFilesToInject: []
            }
        }

        componentWillMount() {
            this.globalCssLinks()
        }

        render() {
            const { style } = this.props
            const containerStyle = {
                width: '100%',
                height: '100%',
                margin: 0,
                ...style
            }

            return (
                <Frame
                    style={containerStyle}
                    frameBorder={'0'}
                    head={this.getIframeHead()}
                >
                    <WrappedComponent {...this.props} />
                </Frame>
            )
        }
    }

    IframeWrapperComponent.propTypes = {
        cssToInsertInIframe: PropTypes.arrayOf(PropTypes.string),
        cssToInsert: PropTypes.string,
        cssUrlsToInsert: PropTypes.arrayOf(PropTypes.string),
        jsUrlsToInsert: PropTypes.arrayOf(PropTypes.string)
    }

    IframeWrapperComponent.defaultProps = {
        cssUrlsToInsert: [],
        jsUrlsToInsert: []
    }

    return cssObserver(IframeWrapperComponent)
}
