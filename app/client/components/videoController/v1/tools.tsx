import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './css/Tools.module.css'
import Container from './container'
import ButtonLayout from '../../layout/v1/buttonLayout'
import { 
  cropIcon, 
  filmIcon,
  arrowClockwiseIcon,
  arrowRightCircleFillIcon } from '../../../public/static/icons'
import { CSSTransition } from 'react-transition-group'
import Crop from '../../tools/v1/crop'
import Trim from '../../tools/v1/trim'
import { useStore } from '../../../hooks'
import Rotate from '../../tools/v1/rotate'

const Tools = (props: any) => {
  const { name } = props
  const [activeMenu, setActiveMenu] = useState<string>('main')
  const [menuHeight, setMenuHeight] = useState<number|null>(null)
  const [title, setTitle] = useState<string>('Tools')
  const {state}: any = useStore()
  const {isVideo, status} = state.studio

  // Set default menu height
  useEffect(() => {
    setMenuHeight(null)
  }, [status])

  // Set menu height for each components
  useEffect(() => {
    setActiveMenu('main')
    const elem: HTMLElement|null = document.getElementById('tools-main')
    if (elem == null) return
    const height: number = elem.offsetHeight
    setMenuHeight(height)
  }, [])

  // Calculate height of the element
  function calcHeight(el: HTMLElement) {
    const height: number = el.offsetHeight
    setMenuHeight(height)
  }

  // Handle change menu layout
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
        setTitle('Tools')
        setActiveMenu('main')
      }
    }
  }

  return (
    <Container title={title} height={menuHeight} name='tools' backFunc={handleBackFunc()}>
      
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div id='tools-main'>
          <div onClick={() => handleChangeLayout('Crop', 'crop-video')}><ButtonLayout>
            <div>
              <div className={styles.icon}>{cropIcon}</div>
              <div className={styles.text}><p>Crop</p></div>
            </div>
            <div>
              <div className={styles.icon_right}>{arrowRightCircleFillIcon}</div>
            </div>
          </ButtonLayout></div>
          {!isVideo && (<div onClick={() => handleChangeLayout('Rotate', 'rotate-video')}><ButtonLayout>
            <div>
              <div className={styles.icon}>{arrowClockwiseIcon}</div>
              <div className={styles.text}><p>Rotate</p></div>
            </div>
            <div>
              <div className={styles.icon_right}>{arrowRightCircleFillIcon}</div>
            </div>
          </ButtonLayout></div>)}
          {isVideo && (<div onClick={() => handleChangeLayout('Trim', 'trim-video')}><ButtonLayout>
            <div>
              <div className={styles.icon}>{filmIcon}</div>
              <div className={styles.text}><p>Trim</p></div>
            </div>
            <div>
              <div className={styles.icon_right}>{arrowRightCircleFillIcon}</div>
            </div>
          </ButtonLayout></div>)}
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'crop-video'}
        timeout={300}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div><Crop name={name}/></div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'rotate-video'}
        timeout={300}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div><Rotate /></div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'trim-video'}
        timeout={300}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div><Trim /></div>
      </CSSTransition>
    </Container>
  )
}

export default Tools

Tools.propTypes = {
  name: PropTypes.string.isRequired
}