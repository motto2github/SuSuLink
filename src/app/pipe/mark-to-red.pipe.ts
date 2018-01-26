import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'markToRed'
})
export class MarkToRedPipe implements PipeTransform {

  transform(src: string, matched?: string): string {
    if (!src || !matched) return src;
    matched = matched.replace(/\\/g, '\\\\').replace(/\./g, '\\.')
                     .replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let regexp = new RegExp(`(${matched})`, 'i');
    return src.replace(regexp, '<span class="text-danger bg-danger">$1</span>');
  }

}
