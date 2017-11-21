import React from 'react'
import PropTypes from 'prop-types'

import CodeMirror from '@skidding/react-codemirror'
// import emmetCodemirror from '@emmetio/codemirror-plugin'
import codeMirrorInstance from 'jspm_packages/npm/codemirror@5.31.0/lib/codemirror.js'
// emmetCodemirror(codeMirrorInstance)
import PreviewSectionHeader from './preview_section_header.js'
import { componentJsx } from '../playground/transpile_helpers.js'
import { formatCode } from '../playground/code_formatter.js'

class PreviewCodeSection extends React.PureComponent {
    render() {
        let { item, onCodeChange } = this.props
        const style = {
            // display: 'flex',
            // flexDirection: 'column'
            // width: '100%',
            // height: '100%'
        }

        const codeMirrorOptions = {
            lineNumbers: false,
            lineWrapping: true,
            // theme: 'twilight',
            theme: 'base16-light',
            mode: 'jsx',
            smartIndent: false,
            matchBrackets: true,
            viewportMargin: Infinity
        }

        let formattedCode = formatCode(componentJsx(item), {
            line: 0,
            ch: 0
        }).formattedCode.slice(1)

        return (
            <div style={style}>
                <PreviewSectionHeader text="Code" />
                <div>
                    <CodeMirror
                        autoFocus={true}
                        value={formattedCode}
                        onChange={onCodeChange}
                        options={codeMirrorOptions}
                        codeMirrorInstance={codeMirrorInstance}
                    />
                </div>
            </div>
        )
    }
}

PreviewCodeSection.propTypes = {
    item: PropTypes.object.isRequired,
    onCodeChange: PropTypes.func.isRequired
}

PreviewCodeSection.defaultProps = {
    onCodeChange: () => {}
}

export default PreviewCodeSection
