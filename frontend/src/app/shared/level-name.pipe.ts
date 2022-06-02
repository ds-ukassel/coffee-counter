import {Pipe, PipeTransform} from '@angular/core';

export const LEVEL_NAMES = [
  'Newbie coffee tester',
  'Newcomer coffee drinker',
  'Starter coffee brewer',
  'Beginner coffee taster',
  'Intermediate coffee enjoyer',
  'Advanced coffee lover',
  'Expert coffee aficionado',
  'Master coffee connoisseur',
  'Grandmaster coffee consummate',
  'Legendary coffee overlord',
  'Immortal coffee guru',
  'God of coffee',
  'The one above all coffee gods',
];

export function levelName(level: number): string {
  return level < LEVEL_NAMES.length ? LEVEL_NAMES[level] : LEVEL_NAMES[LEVEL_NAMES.length - 1];
}

@Pipe({
  name: 'levelName',
})
export class LevelNamePipe implements PipeTransform {
  transform(value: number): string {
    return levelName(value);
  }
}
