// @flow
import React from 'react'
import PropTypes from 'prop-types'
import './component.css'

type Person = {
    name: string,
    age: number
}

type Props = {
    name: string,
    address: {
        city: string,
        street: string,
        pincode: number
    },
    age: number,
    /**
      * Your brothers and sisters but not from the same parents
      **/
    siblings: Array<Person>
}

export default class HelloWorld extends React.Component {
    props: Props

    render() {
        return (
            <div className="com">
                Hello! {this.props.name}
                <div>
                    You live in{' '}
                    {this.props.address && this.props.address.street}
                </div>
                <div>Your age is {this.props.age}</div>
            </div>
        )
    }
}
