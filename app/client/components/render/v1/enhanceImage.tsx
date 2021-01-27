import React, { useEffect, useState } from 'react'
import styles from './css/EnhanceImage.module.css'
// import PropTypes from 'prop-types'
import ButtonMedium from '../../button/v1/buttonMedium'
import SelectedDropdown from '../../selected/v1/selectedDropdown'
import { useLoader } from '../../../hooks/loader'
import _ from 'lodash'
import { EnhancedImageITF, PaperClass, PaperInfoITF, RenderClass, StyleITF } from '../../../pages/api'
import { useStore } from '../../../hooks'
import { handleUnexceptedStringValue } from '../../../utils/handleUnExceptedValue'
import { DownloadITF, StudioITF, UsePaperITF } from '../../../utils/state'

// Api
const renderApi: RenderClass = new RenderClass()
const paperInfoApi: PaperClass = new PaperClass()

// Dispatch action
const SETSTUDIO: string = 'SETSTUDIO'
const SETDOWNLOAD: string = 'SETDOWNLOAD'
const SETUSEPAPER: string = 'SETUSEPAPER'

const EnhanceImage = () => {
  const [algorithm, setAlgorithm] = useState<string>('')
  const [imageStyle, setImageStyle] = useState<string>('')
  const [paperInfo, setPaperInfo] = useState<PaperInfoITF[]>()
  const { setLoader, clearLoader } = useLoader()
  const { state, dispatch }: any = useStore()
  const { fileId } = state.studio

  // Init paper info
  useEffect(() => {
    handleGetPaperInfo()
  }, [])

  // Fetch paper information
  const handleGetPaperInfo = async () => {
    const res = await paperInfoApi.getByType('image')
    if (res.status != 200) {
      return
    }
    const data = await res.json()
    setPaperInfo([...data])
  }

  // Handle enhanced image
  const handleEnhanceImage = async () => {
    if (!handleUnexceptedStringValue(algorithm)) return
    if (!handleUnexceptedStringValue(imageStyle)) return

    const buttonName: string = 'render-enhanced-image'
    setLoader(buttonName, 'medium')

    const body: EnhancedImageITF = {
      id: fileId,
      algorithm: algorithm,
      model: imageStyle,
      modelVersion: 1,
      crop: false,
      width: undefined,
      height: undefined,
      x: undefined,
      y: undefined,
      rotate: false,
      angle: undefined
    }

    if (state.crop.status == true) {
      body.crop = state.crop.status
      body.width = state.crop.width
      body.height = state.crop.height
      body.x = state.crop.x
      body.y = state.crop.y
    }

    if (state.rotate.status == true) {
      body.rotate = true
      body.angle = state.rotate.angle
    }

    const res = await renderApi.enhanceImage(body)
    if (res.status != 200) {
      return
    }
    const blob = await res.blob()
    const objectURL = URL.createObjectURL(blob)

    const payload: StudioITF = {
      ...state.studio,
      status: true,
      objectUrl: objectURL,
      isVideo: false
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
        <SelectedDropdown value={algorithm} label='Algorithm' options={typeof paperInfo == 'undefined' ? [] : paperInfo.map((p: PaperInfoITF) => {
          return {
            value: p.algorithm,
            label: p.algorithmLabel
          }
        })} name='selected-dropdown-setAlgorithm' handleSelectedDropdown={handleSelectedDropdown}/>
        {algorithm != '' && (
          <SelectedDropdown value={imageStyle} label='Image style' 
          options={typeof paperInfo == 'undefined' ? [] :
        _.filter(paperInfo, function(o) { return o.algorithm == algorithm })[0].styles.map((s: StyleITF) => {
          return {
            value: s.name,
            label: s.label
          }
        })} name='selected-dropdown-setImageStyle' handleSelectedDropdown={handleSelectedDropdown}/>
        )}
      </div>
      <div className={styles.render} onClick={handleEnhanceImage}>
        <ButtonMedium label='Render image' name='render-enhanced-image'/></div>
    </div>
  )
}

export default EnhanceImage

EnhanceImage.propTypes = {}