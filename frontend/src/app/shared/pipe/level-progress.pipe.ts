import {Pipe, PipeTransform} from '@angular/core';


function nextPowerOfTwo(n: number) {
  if (n === 0) return 1;
  n--;
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  return n + 1;
}

export function levelProgress(coffees: number): number {
  const nextLevelAt = nextPowerOfTwo(coffees);
  return 2 * coffees / nextLevelAt - 1;
}

@Pipe({name: 'levelProgress'})
export class LevelProgressPipe implements PipeTransform {

  transform(value: number): number {
    return levelProgress(value);
  }

}

@Pipe({name: 'nextLevel'})
export class NextLevelPipe implements PipeTransform {
  transform(value: number): number {
    return nextPowerOfTwo(value);
  }
}
