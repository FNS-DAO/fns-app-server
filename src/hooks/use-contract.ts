import * as MulticallAbi from 'src/libs/abi/FNSRegistry.json'
import * as FNSRegistryAbi from 'src/libs/abi/FNSRegistry.json'
import * as RegistrarAbi from 'src/libs/abi/Registrar.json'
import * as RegistrarControllerAbi from 'src/libs/abi/RegistrarController.json'
import * as PublicResolverAbi from 'src/libs/abi/PublicResolver.json'
import * as ReverseRegistrarAbi from 'src/libs/abi/ReverseRegistrar.json'

import { ethers } from 'ethers'
import { CONTRACT_ADDRESS } from 'src/config/config.constant'
import { useProvider } from 'src/hooks/use-provider'

const provider = useProvider()
const contract = {
  Multicall: null as any,
  FNSRegistry: null as any,
  Registrar: null as any,
  RegistrarController: null as any,
  PublicResolver: null as any,
  ReverseRegistrar: null as any
}

export function useContractMulticall() {
  if (!contract.Multicall) {
    contract.Multicall = new ethers.Contract(
      CONTRACT_ADDRESS.Multicall,
      MulticallAbi,
      provider
    ) as any
  }
  return contract.Multicall
}

export function useContractFNSRegistry() {
  if (!contract.FNSRegistry) {
    contract.FNSRegistry = new ethers.Contract(
      CONTRACT_ADDRESS.FNSRegistry,
      FNSRegistryAbi,
      provider
    ) as any
  }
  return contract.FNSRegistry
}

export function useContractRegistrar() {
  if (!contract.Registrar) {
    contract.Registrar = new ethers.Contract(
      CONTRACT_ADDRESS.Registrar,
      RegistrarAbi,
      provider
    ) as any
  }
  return contract.Registrar
}

export function useContractRegistrarController() {
  if (!contract.RegistrarController) {
    contract.RegistrarController = new ethers.Contract(
      CONTRACT_ADDRESS.RegistrarController,
      RegistrarControllerAbi,
      provider
    ) as any
  }

  return contract.RegistrarController
}

export function useContractPublicResolver() {
  if (!contract.PublicResolver) {
    contract.PublicResolver = new ethers.Contract(
      CONTRACT_ADDRESS.PublicResolver,
      PublicResolverAbi,
      provider
    ) as any
  }
  return contract.PublicResolver
}

export function useContractReverseRegistrar() {
  if (!contract.ReverseRegistrar) {
    contract.ReverseRegistrar = new ethers.Contract(
      CONTRACT_ADDRESS.ReverseRegistrar,
      ReverseRegistrarAbi,
      provider
    ) as any
  }
  return contract.ReverseRegistrar
}
