import React from 'react'
window.React = React

function validJs(jsToInsert) {
    try {
        eval(jsToInsert)
        return true
    } catch (e) {
        return false
    }
}

export default class PlaygroundPreview extends React.Component {
    getJsxToInsert = () => {
        try {
            return eval(this.props.jsxToInsert)
        } catch (e) {
            return (
                <div>
                    <h4>Error loading jsx</h4>
                    <div>
                        {e.toString()}
                    </div>
                </div>
            )
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            jsxToInsert: this.props.jsxToInsert,
            previousJsxToInsert: React.createElement('span')
        }
    }

    componentWillReceiveProps(nextProps) {
        // This is the crazy part. We insert methods which the user has defined in the JS editor section
        // something like `this.handleThisButtonClick = () => this.setState({...})`
        if (
            nextProps.jsToInsert !== this.props.jsToInsert &&
            validJs.bind(this, nextProps.jsToInsert)
        ) {
            eval(nextProps.jsToInsert)
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
