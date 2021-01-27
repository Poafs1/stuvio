import { useStore } from '../hooks'
import PropTypes from 'prop-types'
import { useWindowSize } from '../hooks/windowSize'
import dynamic from 'next/dynamic'
import Head from '../components/index/v1/head'
const Hoc = dynamic(() => import('../components/index/v1/hoc'))
const Nav = dynamic(() => import('../components/index/v1/nav'))

const Layout = (props: any) => {
  const { state }: any = useStore()
  const size = useWindowSize()

  return(
    <>
      <Head title={props.title} description={props.description}/>
      <Nav />
      <div className='container'>
        {typeof size != 'undefined' && typeof size.width != 'undefined' && size.width >= 768 ? (
          <Hoc>{state.componentMount && props.children}</Hoc>
        ) : (
          <div className='not-support-container'><p>Sorry, we are not support this screen resolution.</p></div>
        )}
      </div>
    </>
  )
}

export default Layout

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired
}