import React from 'react'
import NextHead from 'next/head'
import PropTypes from 'prop-types'
import { HOST } from '../../../configs'

const defaultDescription: string = ''
const defaultKeywords: string = ''
const domain: string | undefined = HOST

const Head = (props: any) => {
  return (
    <>
      <NextHead>
      {/* App version: 2 tsx */}
      <meta charSet="UTF-8" />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='viewport' content='minimum-scale=1, maximum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
      <title>{props.title || ''}</title>
      <meta name="description" content={props.description || defaultDescription} />
      <meta name="keywords" content={defaultKeywords}/>
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:url' content={domain} />
      <meta name='twitter:title' content={props.title || ''} />
      <meta name='twitter:description' content={props.description || defaultDescription} />
      <meta name='twitter:creator' content='@DavidWShadow' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={props.title || ''} />
      <meta property='og:url' content={domain} />
      <link rel="shortcut icon" href="/favicon.ico" />
      </NextHead>
    </>
  )
}

Head.propType = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string
}

export default Head