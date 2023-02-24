import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Interval } from '@nestjs/schedule'
import { Model } from 'mongoose'
import { useContractFNSRegistry, useContractRegistrar } from 'src/hooks/use-contract'
import { useProvider } from 'src/hooks/use-provider'
import { NodeNameDocument, Node_Name } from 'src/schemas/node.map.schema'
import { Transfer_Event, TransferEventDocument } from 'src/schemas/transfer.event.schema'

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Transfer_Event.name, 'fns')
    private readonly transferEventModel: Model<TransferEventDocument>,
    @InjectModel(Node_Name.name, 'fns')
    private readonly nodeNameModel: Model<NodeNameDocument>
  ) {}

  private readonly logger = new Logger(TasksService.name)
  private readonly provider = useProvider()

  @Interval(5000)
  async syncEvents() {
    try {
      await this.syncTransferEvents()
    } catch (error) {
      this.logger.error(error)
    }
  }

  async syncTransferEvents(): Promise<any> {
    const SYNC_ROUND_LEN = 20000
    const [blockHeight, breakpointTransferEvent] = await Promise.all([
      this.provider.getBlockNumber(),
      this.getDbBreakpointTransferEvent()
    ])

    const START = breakpointTransferEvent?.blockNumber || 0
    const END = Math.min(START + SYNC_ROUND_LEN, blockHeight)
    const _events = await this.getTransferEvents(START, END)
    if (!_events.length) return

    const names = await Promise.all(_events.map(({ args: [node] }) => this.mapToName(node)))
    const events = _events.map(
      ({ args: [node, to], event, blockNumber, transactionIndex, logIndex }, i: number) => ({
        node,
        name: names[i],
        to: to.toString().toLowerCase(),
        event,
        blockNumber,
        transactionIndex,
        logIndex
      })
    )
    await this.transferEventModel.deleteMany({ blockNumber: START })
    await this.transferEventModel.insertMany(events)

    this.logger.debug(`Sync ${events.length} events of Transfer()`)
  }

  async mapToName(node: string) {
    const Registrar = useContractRegistrar()
    const name = (await this.getNameByNodeInDb(node)) || (await Registrar.getNameByNode(node))
    return name ? (/\.fil$/.test(name) ? name : `${name}.fil`) : ''
  }

  async getNameByNodeInDb(node: string) {
    const item = await this.nodeNameModel.findOne({ node }, { _id: 0, name: 1 }).lean()
    return item?.name
  }

  async getTransferEvents(START: number, END: number, segLen = 2000): Promise<any> {
    const contract = useContractFNSRegistry() as any
    const segNum = Math.ceil((END - START) / segLen) || 1

    const eventsReqs = [] as any
    const filter = await contract.filters.Transfer()

    for (let i = 1; i <= segNum; i++) {
      const [start, end] = [START + (i - 1) * segLen, i < segNum ? START + i * segLen - 1 : END]
      console.log([start, end])
      eventsReqs.push(contract.queryFilter(filter, start, end))
    }

    const _events = (await Promise.all(eventsReqs))
      .flat()
      .filter(({ removed }) => !removed)
      .map(e => JSON.stringify(e))

    return [...new Set(_events)].map(e => JSON.parse(e))
  }

  async getDbBreakpointTransferEvent(): Promise<any> {
    const breakpointTransferEvent = (
      await this.transferEventModel
        .find()
        .sort({ blockNumber: -1, transactionIndex: -1, logIndex: -1 })
        .skip(0)
        .limit(1)
        .lean()
    )?.[0]

    return breakpointTransferEvent
  }
}
