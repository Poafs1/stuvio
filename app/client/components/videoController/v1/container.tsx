import React, { useEffect } from 'react'
import styles from './css/Container.module.css'
import PropTypes from 'prop-types'
import { arrowLeftCircleFillIcon } from '../../../public/static/icons'
import { useStore } from '../../../hooks'

const UPDATECONTAINER: string = 'UPDATECONTAINER'

const Container = (props: any) => {
  const { title, height, name, backFunc } = props
  const { state, dispatch }:any = useStore()
  const { status, updateContainer } = state.studio

  // Update container height
  useEffect(() => {
    if (!updateContainer) return
    const elem: HTMLElement|null = document.getElementById(`container-${name}`)
    if (elem == null) return
    const child: HTMLCollection = elem.children
    if (child.length == 0) return
    const c: HTMLElement|null = child[0] as HTMLElement
    if (c == null) return
    elem.style.height = c.offsetHeight + 'px'
    dispatch({ type: UPDATECONTAINER, payload: false })
  }, [updateContainer])

  // Handle container height
  useEffect(() => {
    const elem: HTMLElement|null = document.getElementById(`container-${name}`)
    if (elem == null) return
    if (status && (typeof height == 'undefined' || height == null)) {
      const child: HTMLCollection = elem.children
      let sumHeight: number = 0
      for(let i:number=0; i<child.length; i++) {
        const c = child[i] as HTMLElement
        sumHeight += c.offsetHeight
      }
      elem.style.height = sumHeight + 'px'
      return
    }
    elem.style.height = height + 'px'
  }, [height, status])

  return(
    <div className={styles.container}>
      <div className={styles.header}>
        {typeof backFunc != 'undefined' && (
          <div className={styles.icon} onClick={backFunc}>{arrowLeftCircleFillIcon}</div>
        )}
        <div className={styles.title}><h1>{title}</h1></div>
      </div>
      <div id={`container-${name}`} className={styles.content}>{props.children}</div>
    </div>
  )
}

export default Container

Container.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  height: PropTypes.number,
  backFunc: PropTypes.func
}