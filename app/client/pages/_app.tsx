import React, { useEffect, useState } from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import { StoreProvider } from '../hooks'
import { PROD } from '../configs'
!PROD && require('../styles/index.css')
PROD && require('../styles/index.prod.css')
import 'tippy.js/dist/tippy.css';
import "cropperjs/dist/cropper.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  // Wait for mounting browser
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return(
    <StoreProvider>
      {isMounted && <Component {...pageProps}/>}
    </StoreProvider>
  )
}

export default MyApp
