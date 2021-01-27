import React, { useEffect } from 'react'
import Timeline from '../components/videoController/v1/timeline'
import Layout from '../layouts'
import { HeaderITF } from '../utils/head'
import Preview from '../components/video/v1/preview'
import Player from '../components/videoController/v1/player'
import Files from '../components/videoController/v1/files'
import Tools from '../components/videoController/v1/tools'
import Render from '../components/videoController/v1/render'
import { useStore } from '../hooks'
import Dropfile from '../components/dropfile/v1/dropfile'
import { FilesClass } from './api'
import { handleUnexceptedStringValue } from '../utils/handleUnExceptedValue'
import { StudioITF } from '../utils/state'
import Waiter from '../components/waiter/v1/waiter'
import Download from '../components/download/v1/download'

// Use for dispatch react hook global state
const SETSTUDIO = 'SETSTUDIO'
const RESETTOOLS = 'RESETTOOLS'

// Page title
const defaultProps: HeaderITF = {
  title: 'Stuvio | Studio'
}

const initName: string = 'studio-video'

// Files Api
const filesAPI: FilesClass = new FilesClass()

const Studio = () => {
  const { state, dispatch }: any = useStore()
  const { status, isVideo } = state.studio

  // Reset global state on loading page
  useEffect(() => {
    dispatch({ type: RESETTOOLS })
  }, [])

  // Handle drag & drop and upload file to server
  const handleOnChange = async (acceptedFiles: File[]) => {
    const file: File = acceptedFiles[0]
    if (typeof file == 'undefined') return
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

  return(
    <Layout {...defaultProps}>
      <div className='studio-container'>
        <Waiter name='studio'/>

        {/** Preview video */}
        <div className='studio-preview-video'>
          <Preview name={initName}/>
        </div>

        {/** Tools */}
        <div className='studio-tools'>
          {!status && <div className='studio-tools-dropzone'>
              <Dropfile handleOnChange={handleOnChange}/>
            </div>}
          {state.download.status ? 
            (<div className='studio-tools-download'>
              <Download />
            </div>) : (
            <div>
              <Render name={initName}/>
              <Player name={initName}/>
              <Files />
              <Tools name={initName}/>
            </div>
          )}
        </div>

        {/** Timeline */}
        {!status && <div className='studio-timeline'>
        <div className='studio-timeline-dropzone'>
          <Dropfile handleOnChange={handleOnChange}/>
        </div></div>}
        {(status && isVideo) && (
          <div className='studio-timeline'>
            <Timeline name={initName}/>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Studio