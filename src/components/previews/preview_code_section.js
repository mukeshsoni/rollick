import React from 'react'
import PropTypes from 'prop-types'

import 'jspm_packages/npm/codemirror@5.31.0/mode/jsx/jsx.js'
import 'node_modules/codemirror/lib/codemirror.css!css'
import 'node_modules/codemirror/theme/base16-light.css!css'
import CodeMirror from '@skidding/react-codemirror'
import codeMirrorInstance from 'jspm_packages/npm/codemirror@5.31.0/lib/codemirror.js'
import PreviewSectionHeader from './preview_section_header.js'
import Button from '../buttons/button.js'
import { componentJsx, transpile } from '../../tools/transpile_helpers.js'
import { formatCode } from '../../tools/code_formatter.js'

class PreviewCodeSection extends React.PureComponent {
    render() {
        let {
            item,
            onCodeChange,
            jsxCode,
            onEditorFocusChange,
            onSavePropClick,
            onFormatCodeClick
        } = this.props
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
        let { error } = transpile(formattedCode)

        return (
            <div>
                <style>
                    {cssToInsert}
                </style>
                <PreviewSectionHeader text="Code" />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: 8
                    }}
                >
                    <Button
                        label="Format code"
                        size="small"
                        onClick={onFormatCodeClick}
                        style={{ marginRight: '1em' }}
                    />
                    <Button
                        label="Save props"
                        size="small"
                        onClick={onSavePropClick}
                        enabled={!error}
                    />
                </div>
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
                {error
                    ? <div
                          style={{
                              color: 'red',
                              marginTop: '0.5em',
                              fontSize: '0.9em',
                              paddingLeft: '0.1em'
                          }}
                      >
                          Invalid JSX - {error.toString()}
                      </div>
                    : null}
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
    onEditorFocusChange: PropTypes.func.isRequired,
    /**
     * callback invoked when 'Save props' button is clicked
     **/
    onSavePropClick: PropTypes.func.isRequired,
    /**
     * callback invoked when 'Format code' button is clicked
     **/
    onFormatCodeClick: PropTypes.func.isRequired
}

PreviewCodeSection.defaultProps = {
    onCodeChange: () => {}
}

export default PreviewCodeSection
