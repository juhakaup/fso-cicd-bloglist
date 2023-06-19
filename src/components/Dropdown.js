import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Dropdown = (props) => {
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState('view')

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
    setLabel(label === 'view' ? 'hide' : 'view')
  }

  return (
    <div>
      {props.title }<button id="view-button" onClick={toggleVisibility}>{label}</button>
      <div className='dropdown' style={showWhenVisible}>
        {props.children}
      </div>
    </div>
  )

}

Dropdown.propTypes = {
  title: PropTypes.string.isRequired
}

export default Dropdown