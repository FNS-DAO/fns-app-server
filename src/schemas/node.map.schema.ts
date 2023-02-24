import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false })
export class Node_Name {
  @Prop() node: string
  @Prop() name: string
}

export type NodeNameDocument = Node_Name & Document
export const NodeNameSchema = SchemaFactory.createForClass(Node_Name)
NodeNameSchema.index({ node: 1 }, { unique: true })
