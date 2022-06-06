import {NgModule} from '@angular/core';
import {LevelNamePipe} from './pipe/level-name.pipe';
import {LevelProgressPipe, NextLevelPipe} from './pipe/level-progress.pipe';
import {LevelPipe} from './pipe/level.pipe';

const declarations = [
  LevelPipe,
  LevelProgressPipe,
  LevelNamePipe,
  NextLevelPipe,
];

@NgModule({
  imports: [],
  declarations,
  exports: declarations,
})
export class SharedModule {
}
