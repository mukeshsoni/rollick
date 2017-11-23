import React from 'react'
import PropTypes from 'prop-types'

import 'jspm_packages/npm/codemirror@5.31.0/mode/jsx/jsx.js'
import 'node_modules/codemirror/lib/codemirror.css!css'
import 'node_modules/codemirror/theme/base16-light.css!css'
import CodeMirror from '@skidding/react-codemirror'
import codeMirrorInstance from 'jspm_packages/npm/codemirror@5.31.0/lib/codemirror.js'
import PreviewSectionHeader from './preview_section_header.js'
import { componentJsx } from '../playground/transpile_helpers.js'
import { formatCode } from '../playground/code_formatter.js'

class PreviewCodeSection extends React.PureComponent {
    render() {
        let { item, onCodeChange, jsxCode, onEditorFocusChange } = this.props
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

        let formattedCode =
            jsxCode ||
            formatCode(componentJsx(item), {
                line: 0,
                ch: 0
            }).formattedCode.slice(1)

        let cssToInsert = '.ReactCodeMirror .CodeMirror { height: 100% }'

        return (
            <div>
                <style>
                    {cssToInsert}
                </style>
                <PreviewSectionHeader text="Code" />
                <div>
                    <CodeMirror
                        autoFocus={false}
                        value={formattedCode.trim('\n')}
                        onChange={onCodeChange}
                        options={codeMirrorOptions}
                        codeMirrorInstance={codeMirrorInstance}
                        onFocusChange={onEditorFocusChange}
                    />
                </div>
            </div>
        )
    }
}

PreviewCodeSection.propTypes = {
    item: PropTypes.object.isRequired,
    onCodeChange: PropTypes.func.isRequired,
    /**
     * When the editor is in focus or goes out of focus
     **/
    onEditorFocusChange: PropTypes.func.isRequired
}

PreviewCodeSection.defaultProps = {
    onCodeChange: () => {}
}

export default PreviewCodeSection
