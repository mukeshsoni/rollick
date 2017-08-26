import React from 'react'
import ReactDOM from 'react-dom'

import { HelloWorld } from 'reactpen/component.js'

let container = document.getElementById('container')

let component = ReactDOM.render(React.createElement(HelloWorld), container)
