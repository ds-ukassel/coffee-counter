import {Pipe, PipeTransform} from '@angular/core';

export function level(coffees: number): number {
  return Math.log2(coffees) | 0;
}

@Pipe({
  name: 'level',
})
export class LevelPipe implements PipeTransform {
  transform(value: number): number {
    return level(value);
  }
}
