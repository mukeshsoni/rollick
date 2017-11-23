// @flow
import React from 'react'
import PropTypes from 'prop-types'
import './component.css'

type Props = {
    name: string
}

export default class HelloWorld extends React.Component {
    props: Props

    render() {
        return (
            <span className="com">
                Hello! {this.props.name}
            </span>
        )
    }
}
