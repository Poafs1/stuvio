import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import styles from './css/Dropfile.module.css'

const Dropfile = (props: any) => {
  return(
    <div>
      <Dropzone
        onDrop={acceptedFiles => props.handleOnChange(acceptedFiles)}
        accept="image/png, image/jpeg, video/*"
      >
        {({getRootProps, getInputProps}) => (
            <section className={styles.dropzone_container}>
              <div {...getRootProps({className: styles.dropzone})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
      </Dropzone>
    </div>
  )
}

export default Dropfile

Dropfile.propTypes = {
  handleOnChange: PropTypes.func.isRequired
}