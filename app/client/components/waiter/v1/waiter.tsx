import styles from './css/Waiter.module.css'
import PropTypes from 'prop-types'

const Waiter = (props: any) => {
  const { name } = props

  return(
    <div className={styles.container} id={`waiter-container-${name}`}>
      <div className={styles.title}><h1>Uploading Your Content</h1></div>
      <div className={styles.content}><p>Please wait a few second.</p></div>
    </div>
  )
}

export default Waiter

Waiter.propTypes = {
  name: PropTypes.string.isRequired
}