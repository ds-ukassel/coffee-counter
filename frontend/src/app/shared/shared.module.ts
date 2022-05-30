import {NgModule} from '@angular/core';
import {LevelProgressPipe} from './level-progress.pipe';
import {LevelPipe} from './level.pipe';

const declarations = [
  LevelPipe,
  LevelProgressPipe,
];

@NgModule({
  imports: [],
  declarations,
  exports: declarations,
})
export class SharedModule {
}
