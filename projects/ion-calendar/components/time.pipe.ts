import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: '_ctime' })
export class TimePipe implements PipeTransform {
  transform(
    value: Date | string | number,
    formatString: string = 'HH:mm'
  ): string {
    return moment(value).format(formatString);
  }
}
