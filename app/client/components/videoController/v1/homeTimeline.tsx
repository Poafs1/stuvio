import React, { useEffect, useState } from 'react'
import styles from './css/Timeline.module.css'
// import PropTypes from 'prop-types'
import { handleUnexceptedStringValue } from '../../../utils/handleUnExceptedValue'
import _ from 'lodash'
import { useStore } from '../../../hooks'
import { useWindowSize } from '../../../hooks/windowSize'
import { StudioITF } from '../../../utils/state'

// https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player
// https://jsfiddle.net/bmartel/3h98gsvk/11/

const SETSTUDIOPLAYPAUSE = 'SETSTUDIOPLAYPAUSE'

const HomeTimeline = () => {
  const { state, dispatch }: any = useStore()
  const { componentMount } = state
  const { fileId, status, isVideo, objectUrl, autoPlay } = state.studio
  const size = useWindowSize()
  const [n, setN] = useState<number>(0)

  // Compute size number of image that have to fit the timeline component
  useEffect(() => {
    const progress: HTMLElement | null = document.getElementById(`progress-${fileId}`)
    if (progress == null) return
    const calN = Math.round((progress.offsetWidth / 165))
    setN(calN + 1)
  }, [size])

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

    const video: HTMLElement | null = document.getElementById(fileId)
    const progress: HTMLElement | null = document.getElementById(`progress-${fileId}`)
    const progressBar: HTMLElement | null = document.getElementById(`progress-bar-${fileId}`)
    if (video == null) return
    if (progress == null) return
    if (progressBar == null) return
    
    const src: string = objectUrl
    extractImage(src, n)

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
      progressBar.style.width = Math.floor(((video as HTMLVideoElement).currentTime / (video as HTMLVideoElement).duration) * 100) + '%';
    });

    progress.addEventListener('click', function(e) {
      const pos: number = ((e.offsetX  - this.offsetLeft) / this.offsetWidth);
      (video as HTMLVideoElement).currentTime = pos * (video as HTMLVideoElement).duration;
    })
    
  }, [state.studio, componentMount, size, n])

  // Extract image from video
  const extractImage = (src: string, n: number) => {
    for(let i:number=0; i<n; i++) {
      const video: HTMLVideoElement = document.createElement('video')
      video.setAttribute("id", `video-timeline-${fileId}-${i}`);
      const canvas: HTMLCanvasElement = document.createElement('canvas')
      canvas.width = 165;
      canvas.height = 100;

      // init video -> loadeddata excute
      video.src = src

      video.addEventListener('loadeddata', () => {
        // get frame at select
        if (!isNaN(video.duration)) {
          const pos: number = Math.round((video.duration / n) * i) + 1
          video.currentTime = pos
        }
      })

      video.addEventListener('seeked', () => {
        // draw to canvas
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
        if (ctx == null) return
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL()
        const elem: HTMLElement|null = document.getElementById(`timeline-background-img-${i}`)
        if (elem == null) return
        const img: HTMLImageElement = document.createElement('img')
        img.src = dataUrl
        elem.appendChild(img)

        video.removeAttribute('src')
        video.load()
      })
    }
  }

  return(
    <div className={styles.container} id={`timeline-container-${fileId}`}>
      <div className={styles.bg_img_container}>
        <div className={styles.bg_img}>
          {_.range(0, n+1).map((value: number) => (
            <div id={`timeline-background-img-${value}`} key={`timeline-background-img-${value}`} className={styles.bg_img_element}></div>
          ))}
        </div>
      </div>

      <div className={styles.progress_container} id={`progress-${fileId}`}>
        <span id={`progress-bar-${fileId}`}></span>
      </div>
    </div>
  )
}

export default HomeTimeline

HomeTimeline.propTypes = {}