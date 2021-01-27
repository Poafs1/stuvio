import React, { useEffect, useState } from 'react'
import style from './css/SelectedDropdown.module.css'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useStore } from '../../../hooks'

const UPDATECONTAINER = 'UPDATECONTAINER'

const SelectedDropdown = (props) => {
  const { value, label, options, name, handleSelectedDropdown, defaultValueIndex } = props
  const [selectedOption, setSelectedOption] = useState(null);
  const { dispatch } = useStore()

  useEffect(() => {
    if (typeof defaultValueIndex != 'undefined') {
      setSelectedOption(options[defaultValueIndex])
    }
  }, [])

  useEffect(() => {
    if (value == '' || value == undefined) {
      setSelectedOption(null)
    }
  }, [value])

  useEffect(() => {
    if (selectedOption == null) return
    dispatch({ type: UPDATECONTAINER, payload: true })
    handleSelectedDropdown(name, selectedOption.value)
  }, [selectedOption])

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      zIndex: 99,
      backgroundColor: '#333333',
      fontSize: '14px',
      fontWeight: '400',
      // position: 'absolute'
    }),
  
    control: () => ({
      backgroundColor: '#333333',
      height: 50,
      borderRadius: 5,
      display: 'flex',
      cursor: 'pointer'
    }),
  
    singleValue: (provided, state) => {
      const color = 'white'
      const fontSize = 14
      const fontWeight = 400
  
      return { 
        ...provided, 
        color, 
        fontSize,
        fontWeight 
      };
    },

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = 'red';
      return {
        ...styles,
        backgroundColor: '#333333',
        color: 'white',
        cursor: 'default',
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: '#4D4D4D',
        },

        ':hover': {
          ...styles[':hover'],
          backgroundColor: '#4D4D4D',
        },
      };
    },

    dropdownIndicator: (base, state) => {
      let changes = {
        // all your override styles
        color: '#999999',
        ':hover': {
          color: '#B3B3B3'
        }
      };
      return Object.assign(base, changes);
    },

    indicatorSeparator: (base, state) => {
      let changes = {
        backgroundColor: '#999999'
      };
      return Object.assign(base, changes);
    },

    menuPortal: (base) => {
      return Object.assign({...base, zIndex: 9999})
    }
  }

  return(
    <div className={style.container}>
      <div className={style.title}><p>{label}</p></div>
      <div className={style.dropdown}>
        <Select
          value={selectedOption}
          defaultValue={typeof defaultValueIndex == 'undefined' ? null : options[defaultValueIndex]}
          styles={customStyles}
          menuPortalTarget={document.body}
          onChange={setSelectedOption}
          options={options}/>
      </div>
    </div>
  )
}

export default SelectedDropdown

SelectedDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  defaultValueIndex: PropTypes.number,
  handleSelectedDropdown: PropTypes.func.isRequired,
  value: PropTypes.string
}