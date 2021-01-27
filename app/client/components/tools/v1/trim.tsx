import React, { useState } from 'react'
// import PropTypes from 'prop-types'
import styles from './css/Trim.module.css'
import ButtonMedium from '../../button/v1/buttonMedium'
import { useStore } from '../../../hooks'
import SelectedDropdown from '../../selected/v1/selectedDropdown'
import _ from 'lodash'
import { ToolsClass } from '../../../pages/api'
import { StudioITF, TrimStateITF } from '../../../utils/state'

const toolsApi: ToolsClass = new ToolsClass()

const SETSTUDIO: string = 'SETSTUDIO'
const SETTRIM: string = 'SETTRIM'

const Trim = () => {
  const {state, dispatch}: any = useStore()
  const { duration, fileId } = state.studio
  const [from, setFrom] = useState<number>()
  const [to, setTo] = useState<number>()

  // Handle trim
  const handleTrim = async () => {
    if (typeof from == 'undefined') return
    if (typeof to == 'undefined') return
    if (from >= to) return

    const body = {
      id: fileId,
      start: from,
      end: to,
      crop: false,
      width: undefined,
      height: undefined,
      x: undefined,
      y: undefined
    }

    if (state.crop.status == true) {
      body.crop = true
      body.width = state.crop.width
      body.height = state.crop.height
      body.x = state.crop.x
      body.y = state.crop.y
    }

    const res = await toolsApi.trim(body)
    if (res.status != 200) return
    const blob = await res.blob()
    const objectURL: string = URL.createObjectURL(blob)

    const payload: StudioITF = {
      ...state.studio,
      status: true,
      objectUrl: objectURL,
      isVideo: true
    }
    dispatch({ type: SETSTUDIO, payload: payload })

    const trimPayload: TrimStateITF = {
      status: true,
      start: from,
      end: to
    }
    dispatch({ type: SETTRIM, payload: trimPayload })
  }

  // Handle select dropdown option menu
  const handleSelectedDropdown = (name: string, value: string) => {
    const split = name.split('selected-dropdown-')[1]
    switch(split) {
      case 'setFrom':
        if (parseInt(value) != from) {
          if (typeof to == 'undefined') {
            setTo(undefined)
          }
          if (typeof to != 'undefined'
          && parseInt(value) >= to) {
            setTo(undefined)
          }
        }
        setFrom(parseInt(value))
        return
      case 'setTo':
        setTo(parseInt(value))
        return
      default:
        return
    }
  }

  return(
    <div className={styles.container}>
      <div>
        {(typeof duration != 'undefined' && duration != 0) && (
          <SelectedDropdown value={from?.toString()} label="From" options={_.range(0, duration-1).map((value: number) => {
            return {
              value: value,
              label: value
            }
          })} name='selected-dropdown-setFrom' handleSelectedDropdown={handleSelectedDropdown}/>
        )}
        {typeof from != 'undefined' && 
          <SelectedDropdown value={to?.toString()} label="To" options={_.range(from+1, duration).map((value:number) => {
            return {
              value: value,
              label: value
            }
          })} name='selected-dropdown-setTo' handleSelectedDropdown={handleSelectedDropdown}/>}
      </div>
      <div className={styles.apply} onClick={handleTrim}>
        <ButtonMedium label='Apply' name='tools-trim'/>
      </div>
    </div>
  )
}

export default Trim

Trim.propTypes = {}