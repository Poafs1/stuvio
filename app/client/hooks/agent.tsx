import platform from 'platform'
import { useEffect, useState } from 'react'

interface AgentITF {
  name: string|undefined
  version: string|undefined
  product: string|undefined
  manufacturer: string|undefined
  layout: string|undefined
  os: string|undefined
  description: string|undefined
}

export const useAgent = () => {
  // Set agent information
  const [agent, setAgent] = useState<AgentITF>({
    name: undefined,
    version: undefined,
    product: undefined,
    manufacturer: undefined,
    layout: undefined,
    os: undefined,
    description: undefined
  })

  // Extract agent from browser client
  useEffect(() => {
    const body: AgentITF = {
      name: platform.name,
      version: platform.version,
      product: platform.product,
      manufacturer: platform.manufacturer,
      layout: platform.layout,
      os: platform.os?.toString(),
      description: platform.description
    }

    setAgent(body)
  }, [])

  return agent
}