import React, { useEffect, useState } from 'react'
import styles from './css/Preview.module.css'
import PropTypes from 'prop-types'
import { useStore } from '../../../hooks'
import { StudioITF } from '../../../utils/state'
import Thumb from './thumb'
import { FilesClass } from '../../../pages/api'
import { handleUnexceptedStringValue } from '../../../utils/handleUnExceptedValue'
import _ from 'lodash'
import SelectedDropdown from '../../selected/v1/selectedDropdown'
import Dropfile from '../../dropfile/v1/dropfile'

const SETSTUDIO = 'SETSTUDIO'

const filesAPI: FilesClass = new FilesClass()

const Preview = (props: any) => {
  const { name } = props
  const { state, dispatch }: any = useStore()
  const { status, objectUrl, fileType, isVideo, previewFilesType } = state.studio
  const [select, setSelect] = useState<boolean>(false)
  const [thumbData, setThumbData] = useState([])

  // Handle select video or image button
  useEffect(() => {
    if (!select) {
      handleGetAllVideo()
      const elem: HTMLCollectionOf<Element> = document.getElementsByClassName(styles.select_button)
      if (elem.length == 0) return
      for(let i:number=0; i<elem.length; i++){
        const id: string|null = elem[i].getAttribute('id')
        if (id == null) continue
        if (id == 'select-video') {
          (elem[i] as HTMLElement).style.backgroundColor = '#FFB100';
          (elem[i] as HTMLElement).style.color = '#353537';
        } else {
          (elem[i] as HTMLElement).style.backgroundColor = '#353537';
          (elem[i] as HTMLElement).style.color = 'white';
        }
      }
    } else {
      handleGetAllImage()
      const elem: HTMLCollectionOf<Element> = document.getElementsByClassName(styles.select_button)
      if (elem.length == 0) return
      for(let i:number=0; i<elem.length; i++){
        const id: string|null = elem[i].getAttribute('id')
        if (id == null) continue
        if (id == 'select-image') {
          (elem[i] as HTMLElement).style.backgroundColor = '#FFB100';
          (elem[i] as HTMLElement).style.color = '#353537';
        } else {
          (elem[i] as HTMLElement).style.backgroundColor = '#353537';
          (elem[i] as HTMLElement).style.color = 'white';
        }
      }
    }
  }, [select, status])

  // Handle import file
  const handleOnChange = async (acceptedFiles: File[]) => {
    const file: File = acceptedFiles[0]
    if (typeof file == 'undefined') return

    const waiter: HTMLElement|null = document.getElementById(`waiter-container-studio`)
    const body: HTMLElement|null = document.body
    if (waiter == null) return
    if (body == null) return
    waiter.style.display = 'flex'
    body.style.height = '100vh'
    body.style.overflow = 'hidden'

    const isVideo: boolean = (file.type.includes('video')) ? true : false
    if (isVideo) {
      const res = await filesAPI.uploadVideo(file)
      if (res.status != 200) {
        alert('Upload video error')
        return
      }
      const data = await res.json()
      if (typeof data == 'undefined') return
      if (!handleUnexceptedStringValue(data.id)) return
      handleGetVideoById(data.id)
    } else {
      const res = await filesAPI.uploadImage(file)
      if (res.status != 200) {
        alert('Upload image error')
        return
      }
      const data = await res.json()
      if (typeof data == 'undefined') return
      if (!handleUnexceptedStringValue(data.id)) return
      handleGetImageById(data.id)
    }

    waiter.style.display = 'none'
    body.style.height = ''
    body.style.overflow = ''
  }

  // Init video and image object url
  useEffect(() => {
    if (isVideo) {
      const elem: HTMLVideoElement|null = document.getElementById(`${name}-video`) as HTMLVideoElement
      if (elem == null) return
      elem.src = objectUrl
    }
    if (!isVideo) {
      const elem: HTMLImageElement|null = document.getElementById(`${name}-image`) as HTMLImageElement
      if (elem == null) return
      elem.src = objectUrl
    }
  }, [objectUrl, isVideo])

  // Fetch all video thumbnail and id
  const handleGetAllVideo = async () => {
    const res = await filesAPI.getAllVideo()
    if (res.status != 200) {
      alert('Get all video error')
      return
    }
    const data = await res.json()
    for(let i:number=0; i<data.length; i++) {
      const img: string|undefined = await handleGetPreviewVideoThumbnail(data[i]._id, data[i].duration, data[i].type)
      if (typeof img == 'undefined') return
      data[i].img = img
    }
    setThumbData(_.reverse(data))
  }

  // Fetch all image thumbnail and id
  const handleGetAllImage = async () => {
    const res = await filesAPI.getAllImage()
    if (res.status != 200) {
      alert('Get all image error')
      return
    }
    const data = await res.json()
    for(let i:number=0; i<data.length; i++) {
      const img: string|undefined = await handleGetPreviewImageThumbnail(data[i]._id, data[i].type)
      if (typeof img == 'undefined') return
      data[i].img = img
    }
    setThumbData(_.reverse(data))
  }

  // Get video by id before start edit
  const handleGetVideoById = async (id: string) => {
    const info = await getVideoInfoById(id)
    const blob = await getVideoById({ 
      id: info._id, 
      type: info.type, 
      extension: info.extension, 
      originalResolution: info.originalResolution })

    const payload: StudioITF = {
      ...state.studio,
      status: true,
      objectUrl: blob,
      fileId: info._id,
      fileName: info.originalName,
      extension: info.extension,
      autoPlay: false,
      isPlay: false,
      isVideo: true,
      fileType: info.type,
      duration: info.duration,
      dimensionWidth: info.dimensionWidth,
      dimensionHeight: info.dimensionHeight,
      fps: info.fps,
      originalResolution: info.originalResolution
    }

    dispatch({ type: SETSTUDIO, payload: payload })
  }

  // Get image by id before start edit
  const handleGetImageById = async (id: string) => {
    const res = await filesAPI.getImageById(id)
    if (res.status != 200) {
      alert('Get image by id error')
      return
    }
    const data = await res.json()
    
    const payload: StudioITF = {
      ...state.studio,
      status: true,
      objectUrl: data.preview,
      fileId: data._id,
      fileName: data.originalName,
      extension: data.extension,
      autoPlay: false,
      isPlay: false,
      isVideo: false,
      fileType: data.type,
      duration: 0,
      dimensionWidth: data.dimensionWidth,
      dimensionHeight: data.dimensionHeight,
      fps: undefined,
      originalResolution: ''
    }

    dispatch({ type: SETSTUDIO, payload: payload })
  }

  // Get video info by id
  const getVideoInfoById = async (id: string) => {
    const res = await filesAPI.getVideoInfoById(id)
    if (res.status != 200) {
      alert('Get video info by id error')
      return
    }
    const data = await res.json()
    return data
  }

  // Get video by id
  const getVideoById = async (body: any) => {
    const res = await filesAPI.getVideoById(body)
    if (res.status != 200) {
      alert('Get video by id')
      return
    }
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  }

  // Handle get thumbnail preview for video
  const handleGetPreviewVideoThumbnail = async (id: string, duration: number, type: string) => {
    const body = {
      id: id,
      start: duration < 5 ? 0 : 5,
      end: duration < 5 ? 0 + 1 : 5 + 1,
      interval: 1,
      duration: duration,
      type: type,
      quality: 'x2'
    }
    const res = await filesAPI.getVideoThumbnail(body)
    if (res.status != 200) {
      // alert('Get video thumbnail error')
      return
    }
    const data = await res.json()
    const pImg: string = data[0]
    return pImg
  }

  // Handle get thumbnail preview for image
  const handleGetPreviewImageThumbnail = async (id: string, type: string) => {
    const body = {
      id: id,
      type: type,
      quality: 'x2'
    }
    const res = await filesAPI.getImageThumbnail(body)
    if (res.status != 200) {
      // alert('Get image thumbnail error')
      return
    }
    const data = await res.json()
    const pImg: string = data.preview
    return pImg
  }

  // Handle receive video thumbnail click id
  const handleVideoThumbnailUUID = (id: string) => handleGetVideoById(id)

  // Handle receive image thumbnail click id
  const handleImageThumbnailUUID = (id: string) => handleGetImageById(id)

  // Handle remove video from server by id
  const handleRemoveVideoByUUID = async (id: string) => {
    const res = await filesAPI.removeVideoById(id)
    if (res.status != 200) {
      alert('Something went wrong, please try again.')
      return
    }
    window.location.href = '/studio'
  }

  // Handle remove image from server by id
  const handleRemoveImageByUUID = async (id: string) => {
    const res = await filesAPI.removeImageById(id)
    if (res.status != 200) {
      alert('Something went wrong, please try again.')
      return
    }
    window.location.href = '/studio'
  }

  // Handle select dropdown menu
  const handleSelectedDropdown = (name: string, value: string) => {
    const split = name.split('selected-dropdown-')[1]
    switch(split) {
      case 'setSelect':
        setSelect(JSON.parse(value))
        return
      default:
        return
    }
  }

  return(
    <div className={styles.container}>
      {(status && isVideo) && (
        <div className={styles.video_container}>
          <video preload="metadata" id={`${name}-video`} className={styles.video}>
            <source type={fileType}/>
          </video>
        </div>
      )}
      {(status && !isVideo) && (
        <div className={styles.image_container}>
          <img id={`${name}-image`}/>
        </div>
      )}
      {(!status) && (
        <div className={styles.preview_container}>
          <div className={styles.dropzone_container}>
            <Dropfile handleOnChange={handleOnChange}/>
          </div>
          <div className={styles.select_container}>
            <SelectedDropdown label='Files Type' options={[
              { value: false, label: 'Videos' },
              { value: true, label: 'Images' }
            ]} defaultValueIndex={previewFilesType} name='selected-dropdown-setSelect' handleSelectedDropdown={handleSelectedDropdown}/>
          </div>
          <div className={styles.video_preview_container}>
            {(thumbData.length > 0 && !select) && thumbData.map((data: any) => (
              <div key={`preview-video-thumb-${data._id}`}>
                <Thumb handleRemoveByUUID={handleRemoveVideoByUUID} timestamp={data.timestamp} uuid={data._id} img={data.img.toString()} label={data.originalName} handleThumbnailUUID={handleVideoThumbnailUUID} />
              </div>
            ))}
            {(thumbData.length > 0 && select) && thumbData.map((data: any) => (
              <div key={`preview-image-thumb-${data._id}`}>
                <Thumb handleRemoveByUUID={handleRemoveImageByUUID} timestamp={data.timestamp} uuid={data._id} img={data.img.toString()} label={data.originalName} handleThumbnailUUID={handleImageThumbnailUUID} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Preview

Preview.propTypes = {
  name: PropTypes.string.isRequired
}