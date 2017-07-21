import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'markToRed'
})
export class MarkToRedPipe implements PipeTransform {

  transform(src: string, matched?: string): string {
    return src.replace(new RegExp(`(${matched})`, 'i'), '<span class="text-red">$1</span>');
  }

}
