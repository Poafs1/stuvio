import React, { useEffect, useState } from 'react'
import styles from './css/Player.module.css'
import { useStore } from '../../../hooks'
import { playFillIcon, pauseFillIcon, skipBackwardFillIcon, skipForwardFillIcon, volumeDownFillIcon, volumeMuteFillIcon } from '../../../public/static/icons'
import { StudioITF } from '../../../utils/state'
import PropTypes from 'prop-types'

const SETSTUDIOPLAYPAUSE = 'SETSTUDIOPLAYPAUSE'

const Player = (props: any) => {
  const { name } = props
  const { state, dispatch }: any = useStore()
  const { isPlay, isVideo } = state.studio
  const [play, setPlay] = useState<boolean>(false)
  const [mute, setMute] = useState<boolean>(false)

  // Set is video play
  useEffect(() => {
    setPlay(isPlay)
  }, [isPlay])
  
  // Handle play and pause video in preview component
  const handlePlayPauseVideo = () => {
    const elem: HTMLVideoElement = document.getElementById(`${name}-video`) as HTMLVideoElement
    if (elem == null) return
    if (elem.paused || elem.ended) {
      elem.play()
      const payload: StudioITF = {
        ...state.studio,
        isPlay: true
      }
      dispatch({ type: SETSTUDIOPLAYPAUSE, payload: payload })
    } else {
      elem.pause()
      const payload: StudioITF = {
        ...state.studio,
        isPlay: false
      }
      dispatch({ type: SETSTUDIOPLAYPAUSE, payload: payload })
    }
  }

  // Handle forward preview video for 5 seconds
  const handleForward = () => {
    const elem: HTMLVideoElement = document.getElementById(`${name}-video`) as HTMLVideoElement
    if (elem == null) return
    elem.currentTime = elem.currentTime + 5;
  }

  // Handle backward preview video for 5 seconds
  const handleBackward = () => {
    const elem: HTMLVideoElement = document.getElementById(`${name}-video`) as HTMLVideoElement
    if (elem == null) return
    elem.currentTime = elem.currentTime - 5;
  }

  // Handle mute video sound
  const handleMuteVolume = () => {
    const elem: HTMLVideoElement = document.getElementById(`${name}-video`) as HTMLVideoElement
    if (elem == null) return
    if (elem.muted) {
      elem.muted = false
      setMute(false)
    } else {
      elem.muted = true
      setMute(true)
    }
  }

  return(
    <>
    {(isVideo) && (
      <div className={styles.container}>
        <div className={styles.control}>
          <div onClick={handleBackward} className={styles.down_size}>{skipBackwardFillIcon}</div>
          <div onClick={handlePlayPauseVideo}>{play ? pauseFillIcon : playFillIcon}</div>
          <div onClick={handleForward} className={styles.down_size}>{skipForwardFillIcon}</div>
        </div>
        <div className={styles.control}>
          <div onClick={handleMuteVolume}>{mute ? volumeMuteFillIcon : volumeDownFillIcon}</div>
        </div>
      </div>
    )}
    </>
  )
}

export default Player

Player.propTypes = {
  name: PropTypes.string.isRequired
}