import React, { useEffect, useState } from 'react'
import styles from './css/CaptureFrame.module.css'
import PropTypes from 'prop-types'
import ButtonMedium from '../../button/v1/buttonMedium'
import SelectedDropdown from '../../selected/v1/selectedDropdown'
import { useLoader } from '../../../hooks/loader'
import _ from 'lodash'
import { EnhancedVideoFrameITF, FilesClass, PaperClass, PaperInfoITF, RenderClass, StyleITF } from '../../../pages/api'
import { useStore } from '../../../hooks'
import { handleUnexceptedStringValue } from '../../../utils/handleUnExceptedValue'
import { DownloadITF, StudioITF, UsePaperITF } from '../../../utils/state'

// Api
const renderApi: RenderClass = new RenderClass()
const filesApi: FilesClass = new FilesClass()
const paperInfoApi: PaperClass = new PaperClass()

// Dispatch action
const SETSTUDIO: string = 'SETSTUDIO'
const SETUSEPAPER: string = 'SETUSEPAPER'
const SETDOWNLOAD: string = 'SETDOWNLOAD'

const CaptureFrame = (props: any) => {
  const { name } = props
  const [algorithm, setAlgorithm] = useState<string>('')
  const [imageStyle, setImageStyle] = useState<string>('')
  const [paperInfo, setPaperInfo] = useState<PaperInfoITF[]>()
  const [frameDuration, setFrameDuration] = useState<number>(0)
  const { setLoader, clearLoader } = useLoader()
  const { state, dispatch }:any = useStore()
  const { fileId, fps } = state.studio

  // Init paper info and current frame
  useEffect(() => {
    handleGetPaperInfo()
    handleGetCurrentFrame()
  }, [])

  // Fetch current frame
  const handleGetCurrentFrame = async () => {
    const video: HTMLVideoElement|null = document.getElementById(`${name}-video`) as HTMLVideoElement
    const { currentTime } = video
    const frame: number = parseInt((currentTime * fps).toFixed(0))
    setFrameDuration(frame)
    const body = {
      id: fileId,
      frame: frame+1
    }
    const res = await filesApi.getVideoFrameThumbnail(body)
    if (res.status != 200) return
    const blob = await res.blob()
    const thumbnail = URL.createObjectURL(blob)
    const elem: HTMLElement|null = document.getElementById('capture-frame-preview')
    if (elem == null) return
    elem.innerHTML = ''
    const img: HTMLImageElement = document.createElement('img')
    img.src = thumbnail
    elem.appendChild(img)
  }

  // Fetch paper information
  const handleGetPaperInfo = async () => {
    const res = await paperInfoApi.getByType('image')
    if (res.status != 200) {
      return
    }
    const data = await res.json()
    setPaperInfo([...data])
  }

  // Change capture frame
  const handleCaptureFrame = async () => {
    if (!handleUnexceptedStringValue(algorithm)) return
    if (!handleUnexceptedStringValue(imageStyle)) return

    const buttonName: string = 'render-capture-frame'
    setLoader(buttonName, 'medium')

    const body: EnhancedVideoFrameITF = {
      id: fileId,
      algorithm: algorithm,
      model: imageStyle,
      modelVersion: 1,
      frameDuration: frameDuration,
      crop: false,
      width: undefined,
      height: undefined,
      x: undefined,
      y: undefined
    }

    if (state.crop.status == true) {
      body.crop = state.crop.status
      body.width = state.crop.width
      body.height = state.crop.height
      body.x = state.crop.x
      body.y = state.crop.y
    }

    const res = await renderApi.captureVideoFrame(body)
    if (res.status != 200) {
      return
    }
    const blob = await res.blob()
    const objectURL = URL.createObjectURL(blob)

    const payload: StudioITF = {
      ...state.studio,
      status: true,
      objectUrl: objectURL,
      isVideo: null
    }
    dispatch({ type: SETSTUDIO, payload: payload })

    const pi: PaperInfoITF = _.filter(paperInfo, function(o) { return o.algorithm == algorithm })[0]
    const st: StyleITF = _.filter(pi.styles, function(o) { return o.name == imageStyle })[0]
    const usePaperPayload: UsePaperITF = {
      algorithm: pi.algorithm,
      algorithmLabel: pi.algorithmLabel,
      styleName: st.name,
      styleLabel: st.label,
      styleRate: st.rate,
      paper: pi.paper,
      link: pi.link,
      technique: pi.technique,
      authors: pi.authors,
      type: pi.type
    }

    dispatch({ type: SETUSEPAPER, payload: usePaperPayload })

    const downloadPayload: DownloadITF = {
      ...state.download,
      status: true,
      algorithm: algorithm,
      style: imageStyle,
      paperName: '',
      link: '',
      technique: '',
      authors: '',
      mse: 0,
      ssim: 0,
      psnr: 0
    }

    dispatch({ type: SETDOWNLOAD, payload: downloadPayload })

    clearLoader(buttonName, 'medium')
    return
  }

  // Handle selected dropdown menu
  const handleSelectedDropdown = (name: string, value: string) => {
    const split = name.split('selected-dropdown-')[1]
    switch(split) {
      case 'setAlgorithm':
        if (value != algorithm) {
          setImageStyle('')
        }
        setAlgorithm(value)
        return
      case 'setImageStyle':
        setImageStyle(value)
        return
      default:
        return
    }
  }

  return(
    <div>
      <div>
        <div className={styles.preview} id='capture-frame-preview'></div>
        <div className={styles.update_preview} onClick={handleGetCurrentFrame}><ButtonMedium name='update-capture-frame-preview' label='Update Preview'/></div>
      </div>
      <div>
        <SelectedDropdown label='Algorithm' options={typeof paperInfo == 'undefined' ? [] : paperInfo.map((p: PaperInfoITF) => {
          return {
            value: p.algorithm,
            label: p.algorithmLabel
          }
        })} name='selected-dropdown-setAlgorithm' handleSelectedDropdown={handleSelectedDropdown}/>
        {algorithm != '' && (
          <SelectedDropdown label='Video style' options={typeof paperInfo == 'undefined' ? [] :
          _.filter(paperInfo, function(o) { return o.algorithm == algorithm })[0].styles.map((s: StyleITF) => {
            return {
              value: s.name,
              label: s.label
            }
          })} name='selected-dropdown-setImageStyle' handleSelectedDropdown={handleSelectedDropdown}/>
        )}
      </div>
      <div className={styles.render} onClick={handleCaptureFrame}>
        <ButtonMedium label='Render frame' name='render-capture-frame'/></div>
    </div>
  )
}

export default CaptureFrame

CaptureFrame.propTypes = {
  name: PropTypes.string.isRequired
}