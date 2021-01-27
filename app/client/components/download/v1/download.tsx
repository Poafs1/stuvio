import styles from './css/Download.module.css'
// import PropTypes from 'prop-types'
import { handThumbsUpFillIcon, handThumbsDownFillIcon, xCircleFillIcon } from '../../../public/static/icons'
import ButtonMedium from '../../button/v1/buttonMedium'
import { useStore } from '../../../hooks'
import { useEffect, useState } from 'react'
import { PaperClass, RenderClass, RatePaperStyleITF } from '../../../pages/api'
import { useLoader } from '../../../hooks/loader'

const RESETDOWNLOAD = 'RESETDOWNLOAD'

const renderApi: RenderClass = new RenderClass()
const paperInfoApi: PaperClass = new PaperClass()

const Download = () => {
  const { state, dispatch }:any = useStore()
  const { status, fileId, extension, fileName, isVideo } = state.studio
  const { technique, authors, paper, link, styleName, algorithm } = state.usePaper
  const [rate, setRate] = useState<boolean|undefined>(undefined)
  const { setLoader, clearLoader } = useLoader()

  // Check status for reset download default
  useEffect(() => {
    if (status) return
    dispatch({ type: RESETDOWNLOAD })
  }, [status])

  // Fetch image or video file [download]
  const handleDownloadFile = async () => {
    const buttonName: string = 'download-render-video'
    
    setLoader(buttonName, 'medium')

    if (isVideo == true) {
      const res = await renderApi.downloadSuperResolutionVideo(fileId)
      if (res.status != 200) {
        return
      }
      const blob = await res.blob()
      downloadBlob(blob, `${fileName}.${extension}`)
    } 
    else if (isVideo == false) {
      const res = await renderApi.downloadSuperResolutionImage(fileId)
      if (res.status != 200) {
        return
      }
      const blob = await res.blob()
      downloadBlob(blob, `${fileName}.${extension}`)
    }
    else {
      const res = await renderApi.downloadSuperResolutionVideoFrame(fileId)
      if (res.status != 200) {
        return
      }
      const blob = await res.blob()
      downloadBlob(blob,`${fileName}.jpeg`)
    }

    clearLoader(buttonName, 'medium')
  }

  // Handle back to studio menu
  const handleCloseDownload = () => {
    window.location.href = '/studio'
    dispatch({ type: RESETDOWNLOAD })
  }

  // Download blob func
  function downloadBlob(blob: any, name: string) {
    if (
      window.navigator && 
      window.navigator.msSaveOrOpenBlob
    ) return window.navigator.msSaveOrOpenBlob(blob);

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = data;
    link.download = name;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  // Handle rate algorithm style
  const handleRate = async (thumb: boolean) => {
    if (typeof rate == 'undefined') {
      const body: RatePaperStyleITF = {
        algorithm: algorithm,
        style: styleName
      }
      const res = await paperInfoApi.rate(body)
      if (res.status != 200) return
    }
    setRate(thumb)
    if (thumb) {
      const elemUp: HTMLElement|null = document.getElementById('download-thumb-up')
      if (elemUp == null) return
      elemUp.style.color = '#FFB100'
      const elemDown: HTMLElement|null = document.getElementById('download-thumb-down')
      if (elemDown == null) return
      elemDown.style.color = '#999999'
    } else {
      const elemDown: HTMLElement|null = document.getElementById('download-thumb-down')
      if (elemDown == null) return
      elemDown.style.color = '#FFB100'
      const elemUp: HTMLElement|null = document.getElementById('download-thumb-up')
      if (elemUp == null) return
      elemUp.style.color = '#999999'
    }
  }

  return(
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Render Success</h1>
        <div onClick={handleCloseDownload} className={styles.del}>{xCircleFillIcon}</div>
      </div>
      <div className={styles.content}><p><span>Paper: </span>{paper}</p></div>
      <div className={styles.content}><p><span>Link: </span><a href={link}>{link}</a></p></div>
      <div className={styles.content}><p><span>Technique: </span>{technique}</p></div>
      <div className={styles.content}><p><span>Authors: </span>{authors}</p></div>

      <div className={styles.rate_container}>
        <div id='download-thumb-down' className={styles.rate_thumb} onClick={() => handleRate(false)}>{handThumbsDownFillIcon}</div>
        <div id='download-thumb-up' className={styles.rate_thumb} onClick={() => handleRate(true)}>{handThumbsUpFillIcon}</div>
      </div>

      <div className={styles.download_button} onClick={handleDownloadFile}>
        <ButtonMedium label='Download' name='download-render-video'/></div>
    </div>
  )
}

export default Download

Download.propTypes = {}