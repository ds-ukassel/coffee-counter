import {Pipe, PipeTransform} from '@angular/core';

export function level(coffees: number): number {
  return Math.log2(coffees) | 0;
}

@Pipe({name: 'level'})
export class LevelPipe implements PipeTransform {
  transform(value: number, balance?: number): number {
    return balance && balance < 0 ? -1 : level(value);
  }
}
