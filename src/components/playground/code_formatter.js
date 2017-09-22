import prettier from 'prettier'
import belt from '../../../belt.js'
const { any, isCapitalized, last } = belt

export function cmToPrettierCursorOffset(code, cursor) {
    const allLines = code.split('\n')
    const charsInLineBeforeCursor =
        cursor.line > 0 ? allLines.slice(0, cursor.line).join('\n').length : 0
    return charsInLineBeforeCursor + cursor.ch
}

function prettierToCodeMirrorCursor(code, cursorOffset) {
    const codeTillCursorOffset = code.slice(0, cursorOffset)

    const lineNumber = codeTillCursorOffset.split('\n').length
    const charNumber = last(codeTillCursorOffset.split('\n')).length
    return { line: lineNumber, ch: charNumber }
}

export function formatCode(code, codeMirrorCursor) {
    const prettierCursorOffset = cmToPrettierCursorOffset(
        code,
        codeMirrorCursor
    )

    // TODO
    // prettier throws an exception if it finds a syntax error.
    // need to find out if it returns a promise or not
    try {
        var prettified = prettier.formatWithCursor(code, {
            semi: false,
            cursorOffset: prettierCursorOffset
        })
        const cmCursor = prettierToCodeMirrorCursor(
            prettified.formatted,
            prettified.cursorOffset
        )

        return {
            formattedCode: prettified.formatted,
            cursor: cmCursor,
            error: null
        }
    } catch (error) {
        return {
            error
        }
    }
}
