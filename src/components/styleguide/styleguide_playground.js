import React from 'react'
import PropTypes from 'prop-types'

import SingleComponentPreview from '../previews/single_component_preview.js'

class StyleguidePlayground extends React.Component {
    render() {
        let { selectedComponent, onAddComponent } = this.props
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
                    {selectedComponent
                        ? <a
                              style={{
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  color: 'blue'
                              }}
                              onClick={onAddComponent}
                          >
                              Add this
                          </a>
                        : null}
                </div>
                {selectedComponent &&
                    <div style={{ padding: '2em', height: '100%' }}>
                        <SingleComponentPreview
                            jsUrlsToInsert={jsUrlsToInsert}
                            cssUrlsToInsert={cssUrlsToInsert}
                            cssToInsert={cssToInsertInIframe}
                            item={selectedComponent}
                        />
                    </div>}
            </div>
        )
    }
}

StyleguidePlayground.propTypes = {
    selectedComponent: PropTypes.object.isRequired,
    onAddComponent: PropTypes.func.isRequired
}

export default StyleguidePlayground
