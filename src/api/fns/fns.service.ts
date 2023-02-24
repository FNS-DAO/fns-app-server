import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { namehash } from 'ethers/lib/utils'
import { Model } from 'mongoose'
import { useContractFNSRegistry, useContractRegistrar } from 'src/hooks/use-contract'
import { NodeNameDocument, Node_Name } from 'src/schemas/node.map.schema'
import { Transfer_Event, TransferEventDocument } from 'src/schemas/transfer.event.schema'

@Injectable()
export class FnsService {
  constructor(
    @InjectModel(Transfer_Event.name, 'fns')
    private readonly transferEventModel: Model<TransferEventDocument>,
    @InjectModel(Node_Name.name, 'fns')
    private readonly nodeNameModel: Model<NodeNameDocument>
  ) {}

  async getTransferNodesOf(controller: string) {
    const events = await this.transferEventModel
      .find({ to: controller }, { _id: 0, node: 1 })
      .sort({ blockNumber: -1, transactionIndex: -1, logIndex: -1 })
      .lean()

    return [...new Set(events.map(({ node }) => node))]
  }

  async getNamesControlledBy(controller: string) {
    const FNSRegistry = useContractFNSRegistry()
    const Registrar = useContractRegistrar()

    const transferNodes = await this.getTransferNodesOf(controller)
    const transferNames = await Promise.all(
      transferNodes.map(node => Registrar.getNameByNode(node))
    )

    const validNodes = transferNodes.filter((_, index) => transferNames[index])
    const validNames = transferNames.filter(name => name).map(name => `${name}.fil`)
    const nameOwners = await Promise.all(validNodes.map(node => FNSRegistry.owner(node)))

    return validNames.filter((_, i) => nameOwners[i]?.toLowerCase() == controller)
  }

  async getSubnamesOf(name: string) {
    if (!name) return []

    const reg = new RegExp(`[\\da-zA-Z]+.${name}$`)
    const subnames = await this.transferEventModel
      .find({ name: { $regex: reg } })
      .sort({ blockNumber: -1, transactionIndex: -1, logIndex: -1 })
      .distinct('name')
      .lean()

    return subnames
  }

  async saveNameHash(name: string) {
    if (!name) return null

    const node = namehash(name)
    await this.nodeNameModel.updateOne({ node }, { name, node }, { upsert: true })
    return { name, hash: node }
  }
}
