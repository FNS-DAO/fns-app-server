import { Controller, Get, Param, Post } from '@nestjs/common'
import { ToLowerCasePipe } from 'src/pipes/ToLowerCasePipe.pipe'
import { FnsService } from './fns.service'

@Controller('fns')
export class FnsController {
  constructor(private readonly fnsService: FnsService) {}

  @Get(':controller/names')
  names(@Param('controller', ToLowerCasePipe) controller: string) {
    return this.fnsService.getNamesControlledBy(controller)
  }

  @Get(':name/subnames')
  subnames(@Param('name') name: string) {
    return this.fnsService.getSubnamesOf(name)
  }

  @Post('saveHash/:name')
  saveHash(@Param('name') name: string) {
    return this.fnsService.saveNameHash(name)
  }
}
