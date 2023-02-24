import { Module } from '@nestjs/common'
import { FnsService } from './fns.service'
import { FnsController } from './fns.controller'
import { MongooseModule } from '@nestjs/mongoose'
import mongodb from 'src/config/config.mongodb'
import { Transfer_Event, TransferEventSchema } from 'src/schemas/transfer.event.schema'
import { NodeNameSchema, Node_Name } from 'src/schemas/node.map.schema'

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Transfer_Event.name, schema: TransferEventSchema },
        { name: Node_Name.name, schema: NodeNameSchema }
      ],
      mongodb.connectionName
    )
  ],
  controllers: [FnsController],
  providers: [FnsService]
})
export class FnsModule {}
