import React, { useEffect, useState } from 'react'
import styles from './css/Files.module.css'
import Container from './container'
import { xCircleFillIcon } from '../../../public/static/icons'
import ButtonLayout from '../../layout/v1/buttonLayout'
import { useStore } from '../../../hooks'
import { StudioITF } from '../../../utils/state'
import { FilesClass } from '../../../pages/api'

const SETSTUDIO = 'SETSTUDIO'
const RESETTOOLS = 'RESETTOOLS'

const filesAPI: FilesClass = new FilesClass()

const Files = () => {
  const { state, dispatch }: any = useStore()
  const { status, fileName, isVideo, fileId, duration, fileType } = state.studio
  const [preview, setPreview] = useState<any>(undefined)

  // Init thumbnail preview video
  useEffect(() => {
    if (!status) return
    if (fileId == '') return
    initPreview()
  }, [state.studio])

  // Init thumbnail preview video
  const initPreview = async () => {
    if (isVideo == true) {
      const body = {
        id: fileId,
        start: duration < 5 ? 0 : 5,
        end: duration < 5 ? 0 + 1 : 5 + 1,
        interval: 1,
        duration: duration,
        type: fileType,
        quality: 'x2'
      }
      const res = await filesAPI.getVideoThumbnail(body)

      if (res.status != 200) {
        alert('Get video thumbnail error')
        return
      }

      const data = await res.json()
      const pImg: string = data[0]
      setPreview(pImg)
    } 
    else if (isVideo == false) {
      const body = {
        id: fileId,
        type: fileType,
        quality: 'x2'
      }
      const res = await filesAPI.getImageThumbnail(body)

      if (res.status != 200) {
        alert('Get image thumbnail error')
        return
      }

      const data = await res.json()
      const pImg: string = data.preview
      setPreview(pImg)
    }
  }

  // Handle remove file from studio
  const handleRemoveFiles = () => {
    const payload: StudioITF = {
      ...state.studio,
      status: false,
      objectUrl: '',
      fileId: '',
      fileName: '',
      extension: '',
      autoPlay: false,
      isPlay: false,
      file: undefined,
      isVideo: false,
      fileType: '',
      duration: 0,
      dimensionWidth: 0,
      dimensionHeight: 0,
      fps: undefined,
      originalResolution: '',
      previewFilesType: fileType == 'video' ? 0 : 1
    }
    dispatch({ type: SETSTUDIO, payload: payload })
    dispatch({ type: RESETTOOLS })
  }

  return(
    <Container title="Files" name='files'>
      {status ? (
        <ButtonLayout>
          <div className={styles.container}>
            {/** img */}
            <div className={styles.img}>
              {typeof preview != 'undefined' && <img src={preview}/>}
            </div>
            {/** filename */}
            <div className={styles.name}><p>{fileName}</p></div>
          </div>
          <div className={styles.remove}>
            <div className={styles.remove_icon} onClick={handleRemoveFiles}>{xCircleFillIcon}</div>
          </div>
        </ButtonLayout>
      ) : (
        <ButtonLayout>
          <div className={styles.empty}><p>There're no selected file</p></div>
        </ButtonLayout>
      )}
    </Container>
  )
}

export default Files

Files.propTypes = {}