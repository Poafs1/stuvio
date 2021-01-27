import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './css/Crop.module.css'
// import { arrowCounterclockwiseIcon } from '../../../public/static/icons'
import ButtonMedium from '../../button/v1/buttonMedium'
import { useStore } from '../../../hooks'
import { CropStateITF, StudioITF } from '../../../utils/state'
import Cropper from "react-cropper";
import { FilesClass, ToolsClass } from '../../../pages/api'
// import "cropperjs/dist/cropper.css";

const SETSTUDIOPLAYPAUSE = 'SETSTUDIOPLAYPAUSE'

interface CropperITF {
  x: number,
  y: number,
  width: number,
  height: number
}

const filesApi: FilesClass = new FilesClass()
const toolsApi: ToolsClass = new ToolsClass()

const SETSTUDIO: string = 'SETSTUDIO'
const SETCROP: string = 'SETCROP'

const Crop = (props: any) => {
  const { name } = props
  const { state, dispatch }: any = useStore()
  const { fileId, isVideo, fps, fileType } = state.studio
  const [imagePreview, setImagePreview] = useState<string|null>(null)
  const [cropData, setCropData] = useState<CropperITF|undefined>(undefined)
  const [ratio, setRatio] = useState<number|undefined>()
  const cropperRef = useRef<HTMLImageElement>(null);
  const [cropper, setCropper] = useState<any>();

  // Init
  useEffect(() => {
    if (isVideo) {
      const elem: HTMLVideoElement|null = document.getElementById(`${name}-video`) as HTMLVideoElement
      if (elem == null) return
      pauseVideo(elem)
      captureFrame(elem)
    } else {
      captureFrameImage()
    }
  }, [])

  // Init cropper
  useEffect(() => {
    if (typeof cropper == 'undefined') return
    const ratioNav: HTMLCollectionOf<Element> = document.getElementsByClassName(styles.ratio_nav)
    if (ratioNav.length == 0) return
    const rn: HTMLElement = (ratioNav[0] as HTMLElement);
    rn.style.display = 'block'
    cropper.options.aspectRatio = ratio
    cropper.reset()
  }, [ratio])

  // Pause video before capture
  const pauseVideo = (elem: HTMLVideoElement) => {
    elem.pause()
    const payload: StudioITF = {
      ...state.studio,
      isPlay: false
    }
    dispatch({ type: SETSTUDIOPLAYPAUSE, payload: payload })
  }

  // Capture video frame
  const captureFrame = async (video: HTMLVideoElement) => {
    const { currentTime } = video
    const frame: number = parseInt((currentTime * fps).toFixed(0))
    const body = {
      id: fileId,
      frame: frame+1
    }
    const res = await filesApi.getVideoFrameThumbnail(body)
    if (res.status != 200) return
    const blob = await res.blob()
    const thumbnail = URL.createObjectURL(blob)
    setImagePreview(thumbnail)
  }

  // Get preview crop video frame
  const captureFrameImage = async () => {
    const body = {
      id: fileId,
      type: fileType,
      quality: 'x2',
    }
    const res = await filesApi.getImageThumbnail(body)
    if (res.status != 200) return
    const data = await res.json()
    setImagePreview(data.preview)
  }

  // On crop
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper == null) return
    const { x, y, width, height } = cropper.getData()
    const body: CropperITF = {
      x, y, width, height
    }
    setCropData(body)
  };

  // Handle crop
  const handleCrop = () => {
    if (typeof cropData == 'undefined') return
    const body = {
      id: fileId,
      width: cropData.width,
      height: cropData.height,
      x: cropData.x,
      y: cropData.y,
      trim: false,
      start: undefined,
      end: undefined,
      rotate: false,
      angle: undefined
    }
    if (isVideo) {
      if (state.trim.status == true) {
        body.trim = true
        body.start = state.trim.start,
        body.end = state.trim.end
      }
      handleCropVideo(body)
    } else {
      if (state.rotate.status == true) {
        body.rotate = true
        body.angle = state.rotate.angle
      }
      handleCropImage(body)
    }
  }

  // Handle crop image
  const handleCropImage = async (body: any) => {
    const res = await toolsApi.cropImage(body)
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
    
    const cropPayload: CropStateITF = {
      status: true,
      width: body.width,
      height: body.height,
      x: body.x,
      y: body.y
    }
    dispatch({
      type: SETCROP, payload: cropPayload
    })
  }

  // Handle crop video
  const handleCropVideo = async (body: any) => {
    const res = await toolsApi.cropVideo(body)
    if (res.status != 200) return
    const blob = await res.blob()
    const objectURL: string = URL.createObjectURL(blob)

    const payload: StudioITF = {
      ...state.studio,
      status: true,
      objectUrl: objectURL,
      isVideo: true
    }
    dispatch({ type: SETSTUDIO, payload: payload })

    const cropPayload: CropStateITF = {
      status: true,
      width: body.width,
      height: body.height,
      x: body.x,
      y: body.y
    }
    dispatch({
      type: SETCROP, payload: cropPayload
    })
  }

  // Handle aspect ratio
  const handleAspectRatio = (e: any) => {
    const { dataset } = e.target
    const split = dataset.ratio.split('/')
    const r: number = parseInt(split[0]) / parseInt(split[1])
    setRatio(r)
    const ratioNav: HTMLCollectionOf<Element> = document.getElementsByClassName(styles.ratio_nav)
    if (ratioNav.length == 0) return
    const rn: HTMLElement = (ratioNav[0] as HTMLElement);
    rn.style.transform = `translateX(${dataset.translate}%)`
    const elem: HTMLCollectionOf<Element> = document.getElementsByClassName(styles.ratio_label)
    if (elem.length == 0) return
    for(let i:number=0; i<elem.length; i++) {
      const id = elem[i].getAttribute('id')
      if (id == `cropper-ratio-${dataset.ratio}`) {
        (elem[i] as HTMLElement).style.color = '#353537'
      } else {
        (elem[i] as HTMLElement).style.color = '#999999'
      }
    }
  }

  return(
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}><p>Preview</p></div>
      </div>
      <div className={styles.preview} id='crop-preview'>
        {imagePreview != null && (
          <Cropper
            className='img-preview'
            src={imagePreview}
            viewMode={3}
            zoomable={true}
            dragMode='move'
            guides={true}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            crop={onCrop}
            ref={cropperRef}
            onInitialized={(instance) => {
              setCropper(instance);
            }}
          />
        )}
      </div>
      <div className={styles.ratio_container}>
        <div className={styles.ratio_nav}></div>
        <div className={styles.ratio}>
          <div onClick={handleAspectRatio} data-ratio='16/9' data-translate='0'><p data-ratio='16/9' id='cropper-ratio-16/9' data-translate='0' className={styles.ratio_label}>16:9</p></div>
          <div onClick={handleAspectRatio} data-ratio='3/2' data-translate='100'><p data-ratio='3/2' id='cropper-ratio-3/2' data-translate='100' className={styles.ratio_label}>3:2</p></div>
          <div onClick={handleAspectRatio} data-ratio='1/1' data-translate='200'><p data-ratio='1/1' id='cropper-ratio-1/1' data-translate='200' className={styles.ratio_label}>1:1</p></div>
        </div>
      </div>
      <div className={styles.apply} onClick={handleCrop}>
        <ButtonMedium label='Apply' name='tools-crop'/>
      </div>
    </div>
  )
}

export default Crop

Crop.propsType = {
  name: PropTypes.string.isRequired
}