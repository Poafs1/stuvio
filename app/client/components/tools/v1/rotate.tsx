import styles from './css/Rotate.module.css'
// import PropTypes from 'prop-types'
import { useStore } from '../../../hooks'
import { useEffect, useState } from 'react'
import ButtonMedium from '../../button/v1/buttonMedium'
import { FilesClass, ToolsClass } from '../../../pages/api'
import { RotateStateITF, StudioITF } from '../../../utils/state'

const filesApi: FilesClass = new FilesClass()
const toolsApi: ToolsClass = new ToolsClass()

const SETSTUDIO: string = 'SETSTUDIO'
const SETROTATE: string = 'SETROTATE'

const Rotate = () => {
  const {state, dispatch}: any = useStore()
  const {fileId, fileType} = state.studio
  const [degree, setDegree] = useState<number|undefined>(0)

  // Handle file id and file type before get image thumbnail
  useEffect(() => {
    if (typeof fileId == 'undefined') return
    if (typeof fileType == 'undefined') return
    handleGetImageThumbnail()
  }, [])

  // Handle get image thumbnail
  const handleGetImageThumbnail = async () => {
    const body = {
      id: fileId,
      type: fileType,
      quality: 'x2',
    }

    const elem: HTMLElement|null = document.getElementById('rotate-preview')
    if (elem == null) return
    elem.innerHTML = ''
    const res = await filesApi.getImageThumbnail(body)
    if (res.status != 200) return
    const data = await res.json()
    const img: HTMLImageElement = document.createElement('img') as HTMLImageElement
    img.src = data.preview
    elem.appendChild(img)
  }

  // Handle rotate image
  const handleRotate = async () => {
    if (typeof degree == 'undefined') return
    const body = {
      id: fileId,
      angle: degree,
      crop: false,
      width: undefined,
      height: undefined,
      x: undefined,
      y: undefined
    }

    if (state.crop.status == true){
      body.crop = true
      body.width = state.crop.width
      body.height = state.crop.height
      body.x = state.crop.x
      body.y = state.crop.y
    }
    
    const res = await toolsApi.rotate(body)
    if (res.status != 200) return
    const blob = await res.blob()
    const objectUrl: string = URL.createObjectURL(blob)
    
    const payload: StudioITF = {
      ...state.studio,
      status: true,
      objectUrl: objectUrl,
      isVideo: false
    }
    dispatch({ type: SETSTUDIO, payload: payload })

    const rotatePayload: RotateStateITF = {
      status: true,
      angle: degree
    }
    dispatch({ type: SETROTATE, payload: rotatePayload })
  }

  // Handle preview rotate image [use css]
  const handleRotatePreview = (e: any) => {
    const { dataset } = e.target
    const { ratio, translate } = dataset
    setDegree(parseInt(ratio))
    const rotatePreview: HTMLElement|null = document.getElementById('rotate-preview')
    if (rotatePreview == null) return
    rotatePreview.style.transform = `rotate(${ratio}deg)`
    const ratioNav: HTMLCollectionOf<Element> = document.getElementsByClassName(styles.ratio_nav)
    if (ratioNav.length == 0) return
    const rn: HTMLElement = (ratioNav[0] as HTMLElement);
    rn.style.transform = `translateX(${translate}%)`
    const elem: HTMLCollectionOf<Element> = document.getElementsByClassName(styles.ratio_label)
    if (elem.length == 0) return
    for(let i:number=0; i<elem.length; i++) {
      const id = elem[i].getAttribute('id')
      if (id == `rotate-ratio-${ratio}`) {
        (elem[i] as HTMLElement).style.color = '#353537'
      } else {
        (elem[i] as HTMLElement).style.color = '#999999'
      }
    }
  }

  return(
    <div className={styles.container}>
      {/* ต้งเปลี่ยนไปขอภาพจาก server */}
      <div className={styles.preview} id='rotate-preview'></div>
      <div className={styles.ratio_container}>
        {typeof degree != 'undefined' && <div className={styles.ratio_nav}></div>}
        <div className={styles.ratio}>
          <div onClick={handleRotatePreview} data-ratio='0' data-translate='0'><p data-ratio='0' id='rotate-ratio-0' data-translate='0' className={styles.ratio_label}>0</p></div>
          <div onClick={handleRotatePreview} data-ratio='90' data-translate='100'><p data-ratio='90' id='rotate-ratio-90' data-translate='100' className={styles.ratio_label}>90</p></div>
          <div onClick={handleRotatePreview} data-ratio='180' data-translate='200'><p data-ratio='180' id='rotate-ratio-180' data-translate='200' className={styles.ratio_label}>180</p></div>
          <div onClick={handleRotatePreview} data-ratio='270' data-translate='300'><p data-ratio='270' id='rotate-ratio-270' data-translate='300' className={styles.ratio_label}>270</p></div>
        </div>
      </div>
      <div className={styles.apply} onClick={handleRotate}>
        <ButtonMedium label="Apply" name='rotate-button'/>
      </div>
    </div>
  )
}

export default Rotate

Rotate.propTypes = {}