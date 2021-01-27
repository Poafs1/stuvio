import React, { useEffect, useState } from 'react'
import styles from './css/Timeline.module.css'
import PropTypes from 'prop-types'
import { handleUnexceptedStringValue } from '../../../utils/handleUnExceptedValue'
import _ from 'lodash'
import { useStore } from '../../../hooks'
import { useWindowSize } from '../../../hooks/windowSize'
import { StudioITF } from '../../../utils/state'
import { FilesClass } from '../../../pages/api'

// https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player
// https://jsfiddle.net/bmartel/3h98gsvk/11/

const SETSTUDIOPLAYPAUSE = 'SETSTUDIOPLAYPAUSE'

const filesAPI: FilesClass = new FilesClass()

const Timeline = (props: any) => {
  const { name } = props
  const { state, dispatch }: any = useStore()
  const { componentMount } = state
  const size = useWindowSize()
  const [n, setN] = useState<number>(0)
  const { fileId, autoPlay, status, isVideo, duration, fileType } = state.studio

  // Compute size number of image that have to fit the timeline component
  useEffect(() => {
    const progress: HTMLElement | null = document.getElementById(`progress-${fileId}`)
    if (progress == null) return
    const calN = Math.round((progress.offsetWidth / 165))
    setN(calN + 2)
  }, [size])

  // Init thumbnail preview images to timeline component
  useEffect(() => {
    if (!status) return
    if (fileId == '') return
    initPreview()
  }, [fileId, size, status, n])

  // Clear timeline component on component unmount
  useEffect(() => {
    return () => {
      if (n != 0) {
        for(let i:number=0; i<n+1; i++) {
          const elem: HTMLElement|null = document.getElementById(`timeline-background-img-${i}`)
          if (elem == null) return
          elem.innerHTML = ''
        }
      }
    }
  }, [])

  // Clear timeline component
  useEffect(() => {
    if (n == 0) return
    if (status) return
    for(let i:number=0; i<n+1; i++) {
      const elem: HTMLElement|null = document.getElementById(`timeline-background-img-${i}`)
      if (elem == null) return
      elem.innerHTML = ''
    }
  }, [status, n])

  // Init timeline video for control preview video
  useEffect(() => {
    if (!componentMount) return
    if (!status) return
    if (!isVideo) return
    if (!handleUnexceptedStringValue(fileId)) return
    if (n == 0) return    
    const video: HTMLElement | null = document.getElementById(`${name}-video`)
    const progress: HTMLElement | null = document.getElementById(`progress-${fileId}`)
    const progressBar: HTMLElement | null = document.getElementById(`progress-bar-${fileId}`)
    if (video == null) return
    if (progress == null) return
    if (progressBar == null) return

    video.addEventListener('loadedmetadata', async () => {
      progress.setAttribute('max', (video as HTMLVideoElement).duration.toString())
      const pos: number = 0.0000001 * (video as HTMLVideoElement).duration;
      (video as HTMLVideoElement).currentTime = Math.round(pos)

      if (autoPlay) {
        (video as HTMLVideoElement).play()
        const payload: StudioITF = {
          ...state.studio,
          isPlay: true
        }
        dispatch({ type: SETSTUDIOPLAYPAUSE, payload: payload })
      } else {
        (video as HTMLVideoElement).pause()
        const payload: StudioITF = {
          ...state.studio,
          isPlay: false
        }
        dispatch({ type: SETSTUDIOPLAYPAUSE, payload: payload })
      }
    })

    video.addEventListener('timeupdate', function() {
      const num: number = Math.floor(((video as HTMLVideoElement).currentTime / (video as HTMLVideoElement).duration) * 100)
      if (num == 100) {
        (video as HTMLVideoElement).pause()
        const payload: StudioITF = {
          ...state.studio,
          isPlay: false
        }
        dispatch({ type: SETSTUDIOPLAYPAUSE, payload: payload })
      }
      progressBar.style.width = num + '%';
    });

    progress.addEventListener('click', function(e) {
      const pos: number = ((e.offsetX  - this.offsetLeft) / this.offsetWidth);
      (video as HTMLVideoElement).currentTime = pos * (video as HTMLVideoElement).duration;
    })
    
  }, [state.studio, componentMount, n])

  // Init thumbnail preview images to timeline component
  const initPreview = async () => {
    const body = {
      id: fileId,
      start: 0,
      end: parseInt(duration),
      interval: Math.round(duration / (n+1)) + 1,
      duration: duration,
      type: fileType,
      quality: 'x2'
    }
    
    const res = await filesAPI.getVideoThumbnail(body)
    
    if (res.status != 200) {
      alert('Get video thumbnail error')
      return
    }

    const thumbnails = await res.json()
    
    for(let i: number=0; i<thumbnails.length; i++) {
      const elem: HTMLElement|null = document.getElementById(`timeline-background-img-${i}`)
      if (elem == null) return
      elem.innerHTML = ''
      const img: HTMLImageElement = document.createElement('img')
      img.src = thumbnails[i]
      elem.appendChild(img)
    }
  }

  return(
    <div className={styles.container} id={`timeline-container-${fileId}`}>
      <div className={styles.slider}>
      </div>
    
      <div className={styles.bg_img_container}>
        <div className={styles.bg_img}>
          {_.range(0, n+1).map((value: number) => (
            <div id={`timeline-background-img-${value}`} key={`timeline-background-img-${value}`} className={styles.bg_img_element}></div>
          ))}
        </div>
      </div>

      <div className={styles.progress_container}id={`progress-${fileId}`}>
        <span id={`progress-bar-${fileId}`}></span>
      </div>
    </div>
  )
}

export default Timeline

Timeline.propTypes = {
  name: PropTypes.string.isRequired
}