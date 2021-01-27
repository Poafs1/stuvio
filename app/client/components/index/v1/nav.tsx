import React from 'react'
import styles from './css/Nav.module.css'
import Link from 'next/link'
import PropTypes from 'prop-types'

const Nav = (props: any) => {
  const { white } = props

  return(
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={white ? styles.title_white : styles.title_gradient}><Link href='/'><a>Stuvio.io</a></Link></div>
      </div>
    </div>
  )
}

export default Nav

Nav.propTypes = {
  white: PropTypes.bool
}