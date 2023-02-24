import { ethers } from 'ethers'
import { RPC } from 'src/config/config.constant'

let provider = null as any

export function useProvider() {
  if (!provider) {
    provider = ethers.providers.getDefaultProvider(RPC)
  }

  return provider
}
