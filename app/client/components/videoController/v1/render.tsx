import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './css/Render.module.css'
import Container from './container'
import ButtonLayout from '../../layout/v1/buttonLayout'
import { filePlayFillIcon, imageFillIcon, arrowRightCircleFillIcon, cameraFillIcon } from '../../../public/static/icons'
import { CSSTransition } from 'react-transition-group';
import EnhanceVideo from '../../render/v1/enhanceVideo'
import CaptureFrame from '../../render/v1/captureFrame'
import EnhanceImage from '../../render/v1/enhanceImage'
import { useStore } from '../../../hooks'

const Render = (props: any) => {
  const { name } = props
  const [activeMenu, setActiveMenu] = useState<string>('main')
  const [menuHeight, setMenuHeight] = useState<number|null>(null)
  const [title, setTitle] = useState<string>('Render')
  const { state }:any = useStore()
  const { isVideo, status } = state.studio

  // Update default menu heigth
  useEffect(() => {
    setMenuHeight(null)
  }, [status])

  // Set menu height for each components
  useEffect(() => {
    setActiveMenu('main')
    const elem: HTMLElement|null = document.getElementById('render-main')
    if (elem == null) return
    const height: number = elem.offsetHeight
    setMenuHeight(height)
  }, [])

  // Calculate height of the element
  function calcHeight(el: HTMLElement) {
    const height: number = el.offsetHeight
    setMenuHeight(height)
  }

  // Handle change menu
  const handleChangeLayout = (title: string, menu: string) => {
    setTitle(title)
    setActiveMenu(menu)
  }

  // Handle back to main menu
  const handleBackFunc = () => {
    if (activeMenu == 'main') {
      return undefined
    } else {
      return () => {
        setTitle('Render')
        setActiveMenu('main')
      }
    }
  }

  return(
    <Container title={title} height={menuHeight} name='render' backFunc={handleBackFunc()}>
      
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div id='render-main'>
          {isVideo && (<div onClick={() => handleChangeLayout('Enhance video', 'enhance-video')}><ButtonLayout>
            <div>
              <div className={styles.icon}>{filePlayFillIcon}</div>
              <div className={styles.text}><p>Enhance video</p></div>
            </div>
            <div>
              <div className={styles.icon_right}>{arrowRightCircleFillIcon}</div>
            </div>
          </ButtonLayout></div>)}
          {!isVideo && (<div onClick={() => handleChangeLayout('Enhance image', 'enhance-image')}><ButtonLayout>
            <div>
              <div className={styles.icon}>{imageFillIcon}</div>
              <div className={styles.text}><p>Enhance image</p></div>
            </div>
            <div>
              <div className={styles.icon_right}>{arrowRightCircleFillIcon}</div>
            </div>
          </ButtonLayout></div>)}
          {isVideo && (<div onClick={() => handleChangeLayout('Capture frame', 'capture-frame')}><ButtonLayout>
            <div>
              <div className={styles.icon}>{cameraFillIcon}</div>
              <div className={styles.text}><p>Capture frame</p></div>
            </div>
            <div>
              <div className={styles.icon_right}>{arrowRightCircleFillIcon}</div>
            </div>
          </ButtonLayout></div>)}
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'enhance-video'}
        timeout={300}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div><EnhanceVideo /></div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'enhance-image'}
        timeout={300}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div><EnhanceImage /></div>
      </CSSTransition>
      
      <CSSTransition
        in={activeMenu === 'capture-frame'}
        timeout={300}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div><CaptureFrame name={name}/></div>
      </CSSTransition>

    </Container>
  )
}

export default Render

Render.propTypes = {
  name: PropTypes.string.isRequired
}