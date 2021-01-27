import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './css/Thumb.module.css'
import dayjs from 'dayjs'
import { xCircleFillIcon } from '../../../public/static/icons'

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Thumb = (props: any) => {
  const { uuid, img, label, timestamp } = props
  const date = new Date()

  // Set thumbnail upload date display
  useEffect(() => {
    if (typeof timestamp == 'undefined') return
    if (timestamp == null) return
    date.setTime(timestamp)
  }, [timestamp])

  // Send id back to parent
  const handleUUID = () => {
    props.handleThumbnailUUID(uuid)
  }

  // Send id back to parent for delete
  const handleRemoveByUUID = () => {
    props.handleRemoveByUUID(uuid)
  }

  return(
    <div className={styles.container}>
      <div className={styles.video} onClick={handleUUID}><img src={img}/></div>
      <div className={styles.content}>
        <div className={styles.para} onClick={handleUUID}>
          <div className={styles.title}><p>{label}</p></div>
          <div className={styles.details}>
            <p>{`Upload at: ${dayjs(date).date()} ${monthNames[dayjs(date).month()]} ${dayjs(date).year()}`}</p></div>
        </div>
        <div className={styles.del} onClick={handleRemoveByUUID}>{xCircleFillIcon}</div>
      </div>
    </div>
  )
}

export default Thumb

Thumb.propTypes = {
  uuid: PropTypes.string,
  img: PropTypes.string,
  label: PropTypes.string,
  handleThumbnailUUID: PropTypes.func,
  timestamp: PropTypes.number,
  handleRemoveByUUID: PropTypes.func
}