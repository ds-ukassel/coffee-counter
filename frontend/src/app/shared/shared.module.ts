import {NgModule} from '@angular/core';
import {LevelNamePipe} from './pipe/level-name.pipe';
import {LevelProgressPipe, NextLevelPipe} from './pipe/level-progress.pipe';
import {LevelPipe} from './pipe/level.pipe';
import {TrophyTierPipe} from './pipe/trophy-tier.pipe';

const declarations = [
  LevelPipe,
  LevelProgressPipe,
  LevelNamePipe,
  NextLevelPipe,
  TrophyTierPipe,
];

@NgModule({
  imports: [],
  declarations,
  exports: declarations,
})
export class SharedModule {
}
