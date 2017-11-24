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
        let { siblings } = this.props

        return (
            <div className="com">
                Hello! {this.props.name}
                <div>
                    You live in{' '}
                    {this.props.address && this.props.address.street}
                </div>
                <div>Your age is {this.props.age}</div>
                <div>You have {siblings.length} sibling(s)</div>
                {siblings.map((sibling, index) =>
                    <div
                        style={{ marginLeft: '1em' }}
                        key={'sibling_no_' + index}
                    >
                        {sibling.name} - {sibling.age} years old
                    </div>
                )}
            </div>
        )
    }
}

HelloWorld.defaultProps = {
    siblings: []
}
