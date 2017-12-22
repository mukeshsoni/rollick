import React from 'react'
import ReactDOM from 'react-dom'
import CompositeComponentPreviewNew from './composite_component_preview.js'
import 'src/components/styleguide/loader.css!css'

class PreviewApp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            item: null,
            jsxCode: null,
            containerClasses: '',
            composite: false,
            loading: false
        }
    }

    componentDidMount() {
        window.renderAgain = props => {
            this.setState(props)
        }

        if (window.callMeWhenReady) {
            window.callMeWhenReady()
        } else {
            console.error(
                'Could not find callMeWhenReady from the mother document bridge'
            )
        }
    }

    render() {
        let jsUrlsToInsert = [
            'jspm_packages/npm/codemirror@5.31.0/mode/jsx/jsx.js'
        ]

        let cssUrlsToInsert = [
            'node_modules/codemirror/lib/codemirror.css',
            'node_modules/codemirror/theme/base16-light.css'
        ]
        let cssToInsertInIframe = '.ReactCodeMirror .CodeMirror {height: 100%}'

        let {
            composite,
            item,
            jsxCode,
            jsxToInsert,
            jsToInsert,
            cssToInsert,
            loading,
            externalPackages
        } = this.state

        if (composite) {
            return (
                <div
                    className={this.state.containerClasses}
                    style={{ padding: 20 }}
                >
                    <CompositeComponentPreviewNew
                        jsxCode={jsxCode}
                        jsxToInsert={jsxToInsert}
                        jsToInsert={jsToInsert}
                        cssToInsert={cssToInsert}
                        externalPackages={externalPackages}
                    />
                </div>
            )
        } else if (item && jsxCode) {
            return (
                <div
                    className={this.state.containerClasses}
                    style={{ padding: 20 }}
                >
                    <SingleComponentPreviewNew
                        jsUrlsToInsert={jsUrlsToInsert}
                        cssUrlsToInsert={cssUrlsToInsert}
                        cssToInsert={cssToInsertInIframe}
                        item={item}
                        jsxCode={jsxCode}
                    />
                </div>
            )
        } else {
            return (
                <div className="loader" style={{ width: '100%', height: 300 }}>
                    do you see me?
                </div>
            )
        }
    }
}

ReactDOM.render(
    <PreviewApp showit={false} />,
    document.getElementById('container')
)
