import React from 'react'
import ReactDOM from 'react-dom'

import App from './src/app.js'

let container = document.getElementById('container')

document.getElementById('container').classList.remove('loader')
let component = ReactDOM.render(React.createElement(App), container)
