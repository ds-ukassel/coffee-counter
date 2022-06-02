import {NgModule} from '@angular/core';
import {LevelNamePipe} from './level-name.pipe';
import {LevelProgressPipe} from './level-progress.pipe';
import {LevelPipe} from './level.pipe';

const declarations = [
  LevelPipe,
  LevelProgressPipe,
  LevelNamePipe,
];

@NgModule({
  imports: [],
  declarations,
  exports: declarations,
})
export class SharedModule {
}
