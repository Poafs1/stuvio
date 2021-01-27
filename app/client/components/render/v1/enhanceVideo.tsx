import React, { useEffect, useState } from 'react'
import styles from './css/EnhanceVideo.module.css'
// import PropTypes from 'prop-types'
import ButtonMedium from '../../button/v1/buttonMedium'
import SelectedDropdown from '../../selected/v1/selectedDropdown'
import { useLoader } from '../../../hooks/loader'
import { handleUnexceptedStringValue } from '../../../utils/handleUnExceptedValue'
import { RenderClass, EnhancedVideoITF, PaperClass, PaperInfoITF, StyleITF } from '../../../pages/api'
import { useStore } from '../../../hooks'
import { DownloadITF, StudioITF, UsePaperITF } from '../../../utils/state'
import _ from 'lodash'

// Api
const renderApi: RenderClass = new RenderClass()
const paperInfoApi: PaperClass = new PaperClass()

// Dispatch action
const SETSTUDIO: string = 'SETSTUDIO'
const SETDOWNLOAD: string = 'SETDOWNLOAD'
const SETUSEPAPER: string = 'SETUSEPAPER'

const EnhanceVideo = () => {
  const [algorithm, setAlgorithm] = useState<string>('')
  const [videoStyle, setVideoStyle] = useState<string>('')
  const [paperInfo, setPaperInfo] = useState<PaperInfoITF[]>()
  const { setLoader, clearLoader } = useLoader()
  const { state, dispatch }:any = useStore()
  const { fileId } = state.studio

  // Init paper info
  useEffect(() => {
    handleGetPaperInfo()
  }, [])

  // Fetch paper information
  const handleGetPaperInfo = async () => {
    const res = await paperInfoApi.getByType('video')
    if (res.status != 200) {
      return
    }
    const data = await res.json()
    setPaperInfo([...data])
  }

  // Handle enhanced video
  const handleEnhanceVideo = async () => {
    if (!handleUnexceptedStringValue(algorithm)) return
    if (!handleUnexceptedStringValue(videoStyle)) return

    const buttonName: string = 'render-enhanced-video'
    setLoader(buttonName, 'medium')

    const body: EnhancedVideoITF = {
      id: fileId,
      algorithm: algorithm,
      model: videoStyle,
      modelVersion: 1,
      crop: false,
      width: undefined,
      height: undefined,
      x: undefined,
      y: undefined,
      trim: false,
      start: undefined,
      end: undefined
    }

    if (state.crop.status == true) {
      body.crop = state.crop.status
      body.width = state.crop.width
      body.height = state.crop.height
      body.x = state.crop.x
      body.y = state.crop.y
    }

    if (state.trim.status == true) {
      body.trim = state.trim.status
      body.start = state.trim.start
      body.end = state.trim.end
    }
    
    const res = await renderApi.enhanceVideo(body)
    if (res.status != 200) {
      return
    }
    const blob = await res.blob()
    const objectURL = URL.createObjectURL(blob)

    const payload: StudioITF = {
      ...state.studio,
      status: true,
      objectUrl: objectURL,
      autoPlay: true,
      isPlay: true,
      isVideo: true,
    }
    dispatch({ type: SETSTUDIO, payload: payload })

    const pi: PaperInfoITF = _.filter(paperInfo, function(o) { return o.algorithm == algorithm })[0]
    const st: StyleITF = _.filter(pi.styles, function(o) { return o.name == videoStyle })[0]
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
      style: videoStyle,
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
          setVideoStyle('')
        }
        setAlgorithm(value)
        return
      case 'setVideoStyle':
        setVideoStyle(value)
        return
      default:
        return
    }
  }

  return(
    <div>
      <div>
        <SelectedDropdown value={algorithm} label='Algorithm' options={typeof paperInfo == 'undefined' ? [] : paperInfo.map((p: PaperInfoITF) => {
          return {
            value: p.algorithm,
            label: p.algorithmLabel
          }
        })} name='selected-dropdown-setAlgorithm' handleSelectedDropdown={handleSelectedDropdown}/>
        {algorithm != '' && (
          <SelectedDropdown value={videoStyle} label='Video style' 
          options={typeof paperInfo == 'undefined' ? [] :
          _.filter(paperInfo, function(o) { return o.algorithm == algorithm })[0].styles.map((s: StyleITF) => {
            return {
              value: s.name,
              label: s.label
            }
          })} name='selected-dropdown-setVideoStyle' handleSelectedDropdown={handleSelectedDropdown}/>
        )}
      </div>
      <div className={styles.render} onClick={handleEnhanceVideo}>
        <ButtonMedium label='Render video' name='render-enhanced-video'/></div>
    </div>
  )
}

export default EnhanceVideo

EnhanceVideo.propTypes = {}