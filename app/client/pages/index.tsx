import React, { useEffect } from 'react'
import ButtonMedium from '../components/button/v1/buttonMedium'
import HomeTimeline from '../components/videoController/v1/homeTimeline'
import Layout from '../layouts/home'
import Nav from '../components/index/v1/nav'
import { useStore } from '../hooks'
import { StudioITF } from '../utils/state'

// Background index video directory
const backgroundVideo: string = '../static/videos/index.mp4'

// Page title
const defaultProps = {
  title: 'Stuvio.io | The super resolution cloud video editor'
}

// Use for dispatch global state
const SETSTUDIO = 'SETSTUDIO'

const Index = () => {
  const { state, dispatch }: any = useStore()

  // Clear default video styles
  useEffect(() => {
    const elem: HTMLElement | null = document.getElementById('index-video')
    if (elem == null) return
    elem.setAttribute('data-state', 'visible');
  }, [])

  // Set hook state for timeline video
  useEffect(() => {
    const payload: StudioITF = {
      ...state.studio,
      status: true,
      objectUrl: backgroundVideo, // must not be null
      fileId: 'index-video',
      fileName: 'index.mp4',
      autoPlay: true,
      isPlay: false,
      file: undefined, // must not undefined
      isVideo: true,
      fileType: 'mp4',
      duration: 0,
      dimensionWidth: 0,
      dimensionHeight: 0,
      fps: undefined,
      originalResolution: '',
      previewFilesType: 0
    }
    dispatch({ type: SETSTUDIO, payload: payload })

    // Clear hook state on component unmount
    return () => {
      const payload: StudioITF = {
        ...state.studio,
        status: false,
        objectUrl: '',
        fileId: '',
        fileName: '',
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
        previewFilesType: 0
      }
      dispatch({ type: SETSTUDIO, payload: payload })
    }
  }, [])

  return(
    <Layout {...defaultProps}>
      <video preload="metadata" muted loop id='index-video' className='index-background-video'>
        <source src={backgroundVideo} type="video/mp4"/>
      </video>

      <div className='index-content'>
        <div className='index-nav'><Nav white={true}/></div>
        <div className='index-text'>
          <div className='index-text-title'><h1>Stuvio.io, The Super-Resolution Cloud Video Editor Web Application</h1></div>
          <div className='index-direct-button'><ButtonMedium label="Get Started" links="/studio" name='index'/></div>
        </div>
        <div className='index-video-timeline'>
          <HomeTimeline />
        </div>
      </div>
    </Layout>
  )
}

export default Index