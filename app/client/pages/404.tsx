import React from 'react'
import Layout from '../layouts'
import { HeaderITF } from '../utils/head'

const defaultProps: HeaderITF = {
  title: 'Stuvio | Page not found'
}

const Custom404 = () => {
  return(
    <Layout {...defaultProps}>
      <h1>404 Error Page</h1>
    </Layout>
  )
}

export default Custom404