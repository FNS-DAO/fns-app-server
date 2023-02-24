import { Module } from '@nestjs/common'
import { TasksService } from 'src/schedule/tasks.service'
import { MongooseModule } from '@nestjs/mongoose'
import mongodb from 'src/config/config.mongodb'
import { NodeNameSchema, Node_Name } from 'src/schemas/node.map.schema'
import { Transfer_Event, TransferEventSchema } from 'src/schemas/transfer.event.schema'

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
  providers: [TasksService]
})
export class TasksModule {}
