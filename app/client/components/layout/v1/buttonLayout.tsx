import React from 'react'
import styles from './css/ButtonLayout.module.css'
import PropTypes from 'prop-types'

const ButtonLayout = (props: any) => {
  return(
    <div className={styles.container}>
      {props.children}
    </div>
  )
}

export default ButtonLayout

ButtonLayout.propTypes = {
  children: PropTypes.node.isRequired
}