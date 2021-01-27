import { useEffect, useState } from 'react'
import { useStore } from '../../../hooks'
import PropTypes from 'prop-types'

const SETCOMPONENTMOUNT = 'SETCOMPONENTMOUNT'

const withAccount = (props: any) => {
  const {dispatch}:any = useStore()
  const [componentMount, setComponentMount] = useState(false)

  // Check is account and account status already exist
  useEffect(() => {
    setComponentMount(true)
  }, [])

  useEffect(() => {
    if (!componentMount) return
    dispatch({type: SETCOMPONENTMOUNT})
  }, [componentMount])

  return componentMount && props.children
}

export default withAccount

withAccount.propTypes = {
  children: PropTypes.node.isRequired
}