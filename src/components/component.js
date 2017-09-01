import React from 'react'
import PropTypes from 'prop-types'
import './component.css'

export default class HelloWorld extends React.Component {
    render() {
        return (
            <span className='com'>
                Hello! {this.props.name}
            </span>
        )
    }
}

HelloWorld.propTypes = {
    name: PropTypes.string.isRequired
}
