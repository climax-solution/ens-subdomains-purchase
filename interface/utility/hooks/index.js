import { useEffect, useState } from "react"
import { getBlock, getProvider, ethers } from '@ensdomains/ui'

export function useBlock() {
    const [loading, setLoading] = useState(true)
    const [block, setBlock] = useState(undefined)
  
    useEffect(() => {
      getBlock()
        .then(res => {
          setBlock(res)
          setLoading(false)
        })
        .catch(() => '') // ignore error
    }, [])
  
    return {
      loading,
      block
    }
}