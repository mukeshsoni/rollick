import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Frame from 'react-frame-component'
import Bridge from './bridge.js'

class NewIframeWrapper extends React.Component {
    iframeRef: null
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
                {this.props.jsUrlsToInsert
                    .concat(this.state.jsUrlsToInsert)
                    .map(scriptPath => {
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
                    ),
                    containerClasses: config.globals.containerClasses || '',
                    jsUrlsToInsert:
                        (config.globals.js && config.globals.js.urls) || []
                })
            }
        })
    }

    adjustIframeHeight = () => {
        setTimeout(() => {
            const iframeDOMNode = ReactDOM.findDOMNode(this.iframeRef)

            if (
                iframeDOMNode &&
                iframeDOMNode.contentWindow &&
                iframeDOMNode.contentWindow.document &&
                iframeDOMNode.contentWindow.document.body &&
                iframeDOMNode.height !==
                    iframeDOMNode.contentWindow.document.body.scrollHeight
            ) {
                iframeDOMNode.height = iframeDOMNode.contentWindow.document.body
                    .scrollHeight
                    ? iframeDOMNode.contentWindow.document.body.scrollHeight +
                      'px'
                    : 'auto'
            }

            this.timeoutToken = setTimeout(this.adjustIframeHeight, 500)
        }, 200)
    }

    componentDidUpdate() {
        const iframeDOMNode = ReactDOM.findDOMNode(this.iframeRef)
    }

    onMount = () => {
        this.adjustIframeHeight()
    }

    onUpdate = () => {
        this.adjustIframeHeight()
    }

    constructor(props) {
        super(props)

        this.state = {
            cssToInsertInIframe: [],
            cssFilesToInject: ['src/components/styleguide/loader.css'],
            containerClasses: '',
            jsUrlsToInsert: []
        }
    }

    componentWillMount() {
        this.globalCssLinks()
    }

    componentDidMount() {
        this.timeoutToken = setTimeout(this.adjustIframeHeight, 500)
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutToken)
    }

    render() {
        const { style, item, jsxCode } = this.props
        const containerStyle = {
            width: '100%',
            margin: 0,
            ...style
        }
        let initialContent = `<!DOCTYPE html>
                <html>
                    <head></head>
                    <body>
                        <div id="for-react-frame-component"></div>
                        <div id="container"></div>
                        <script src="jspm_packages/system.js"></script>
                        <script src="jspm.config.js"></script>
                        <script>SystemJS.import("src/components/previews/new/main.js")</script>
                    </body>
                </html>`

        return (
            <Frame
                initialContent={initialContent}
                style={containerStyle}
                frameBorder={'0'}
                head={this.getIframeHead()}
                ref={node => (this.iframeRef = node)}
                contentDidMount={this.onMount}
                contentDidUpdate={this.onUpdate}
            >
                <div className="container2" />
                <Bridge
                    item={item}
                    jsxCode={jsxCode}
                    containerClasses={this.state.containerClasses}
                />
            </Frame>
        )
    }
}

NewIframeWrapper.propTypes = {
    cssToInsertInIframe: PropTypes.arrayOf(PropTypes.string),
    cssToInsert: PropTypes.string,
    cssUrlsToInsert: PropTypes.arrayOf(PropTypes.string),
    jsUrlsToInsert: PropTypes.arrayOf(PropTypes.string)
}

NewIframeWrapper.defaultProps = {
    cssUrlsToInsert: [],
    jsUrlsToInsert: []
}

export default NewIframeWrapper
