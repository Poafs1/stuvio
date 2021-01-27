import dynamic from 'next/dynamic'
import Head from '../components/index/v1/head'
const Hoc = dynamic(() => import('../components/index/v1/hoc')) 
import { useStore } from '../hooks'
import PropTypes from 'prop-types'

const Layout = (props: any) => {
  const { state }: any = useStore()

  return(
    <>
      <Head title={props.title} description={props.description}/>
      <div className='container'>
        <Hoc>{state.componentMount && props.children}</Hoc>
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