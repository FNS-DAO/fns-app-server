import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class ToLowerCasePipe implements PipeTransform {
  transform(value: any) {
    return value?.toString()?.toLowerCase() ?? ''
  }
}
