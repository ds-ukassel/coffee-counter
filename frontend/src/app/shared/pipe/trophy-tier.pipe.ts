import {Pipe, PipeTransform} from '@angular/core';

export enum TrophyTier {
  bronze = 'bronze',
  silver = 'silver',
  gold = 'gold',
  platinum = 'platinum',
}

const TrophyTierMap = {
  bronze: 'text-primary',
  silver: 'text-info',
  gold: 'text-warning',
  platinum: 'text-secondary',
}

@Pipe({
  name: 'trophyTier',
  standalone: false,
})
export class TrophyTierPipe implements PipeTransform {
  transform(value: TrophyTier): string {
    return TrophyTierMap[value];
  }
}
