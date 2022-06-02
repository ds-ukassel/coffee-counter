import {NgModule} from '@angular/core';
import {LevelNamePipe} from './level-name.pipe';
import {LevelProgressPipe, NextLevelPipe} from './level-progress.pipe';
import {LevelPipe} from './level.pipe';

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
