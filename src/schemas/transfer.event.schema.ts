import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false })
export class Transfer_Event {
  @Prop() node: string
  @Prop() name: string
  @Prop() event: string
  @Prop() to: string
  @Prop() blockNumber: number
  @Prop() transactionIndex: string
  @Prop() logIndex: number
}

export type TransferEventDocument = Transfer_Event & Document
export const TransferEventSchema = SchemaFactory.createForClass(Transfer_Event)
TransferEventSchema.index({ blockNumber: 1, transactionIndex: 1, logIndex: 1 }, { unique: true })
