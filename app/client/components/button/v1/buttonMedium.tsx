import React from 'react'
import styles from './css/ButtonMedium.module.css'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Loader from 'react-loader-spinner'

const ButtonMedium = (props: any) => {
  const { label, links, target, name } = props

  return(
    <div className={styles.container}>
      {typeof links != 'undefined' ? (
        <Link href={links} as={target}><a><div className={styles.layout}>{label}</div></a></Link>
      ) : (
        <div className={styles.layout}>
          <div className={styles.spin} id={`button-medium-spin-${name}`}>
          <Loader 
            type='Oval' 
            color='black' 
            height={18} 
            width={18} />
          </div>
          <div className={styles.label}><p>{label}</p></div>
        </div>
      )}
    </div>
  )
}

export default ButtonMedium

ButtonMedium.propTypes = {
  label: PropTypes.string.isRequired,
  links: PropTypes.string,
  target: PropTypes.string,
  name: PropTypes.string.isRequired
}