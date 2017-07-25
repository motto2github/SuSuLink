import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'markToRed'
})
export class MarkToRedPipe implements PipeTransform {

  transform(src: string, matched?: string): string {
    if (!src || !matched) return src;
    return src.replace(new RegExp(`(${matched.replace(/\./g, '\\.')})`, 'i'), '<span class="text-red">$1</span>');
  }

}
