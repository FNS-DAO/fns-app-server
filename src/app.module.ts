import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import mongodb from 'src/config/config.mongodb'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { TasksModule } from './schedule/tasks.module'
import { FnsModule } from './api/fns/fns.module'

@Module({
  imports: [
    FnsModule,
    TasksModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(mongodb.host, { connectionName: mongodb.connectionName })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
