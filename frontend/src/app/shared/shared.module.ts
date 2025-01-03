import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbPopoverModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {LevelNamePipe} from './pipe/level-name.pipe';
import {LevelProgressPipe, NextLevelPipe} from './pipe/level-progress.pipe';
import {LevelPipe} from './pipe/level.pipe';
import {TrophyTierPipe} from './pipe/trophy-tier.pipe';
import {PurchaseListComponent} from './purchase-list/purchase-list.component';

const declarations = [
  LevelPipe,
  LevelProgressPipe,
  LevelNamePipe,
  NextLevelPipe,
  TrophyTierPipe,
];

@NgModule({
  imports: [
    CommonModule,
    NgbPopoverModule,
    NgbTooltipModule,
    declarations,
    PurchaseListComponent,
  ],
  exports: [
    declarations,
    PurchaseListComponent,
  ],
})
export class SharedModule {
}
