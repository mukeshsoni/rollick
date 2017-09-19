import React from 'react'
window.React = React

export default class PlaygroundPreview extends React.Component {
    getJsxToInsert = () => {
        return this.props.jsxToInsert
        // try {
        //     ;(0, eval)('var j = ' + this.props.jsxToInsert)
        //     return j
        // } catch (e) {
        //     // ;(0, eval)('var k = ' + this.props.previousJsxToInsert.toString())
        //     console.error('error evaling jsxtoinsert', e)
        //     return <div>Error evaluating jsx</div>
        // }
    }

    constructor(props) {
        super(props)

        this.state = {
            jsxToInsert: this.props.jsxToInsert,
            previousJsxToInsert: React.createElement('span')
        }
    }

    render() {
        return (
            <div>
                {this.getJsxToInsert()}
            </div>
        )
    }
}
