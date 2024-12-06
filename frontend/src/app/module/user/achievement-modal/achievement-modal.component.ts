import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap, tap} from 'rxjs';
import {Achievement, AchievementInfo} from '../../../core/model/achievement.interface';
import {AchievementService} from '../../../core/service/achievement.service';

@Component({
  selector: 'app-achievement-modal',
  templateUrl: './achievement-modal.component.html',
  styleUrls: ['./achievement-modal.component.scss'],
  standalone: false,
})
export class AchievementModalComponent implements OnInit {
  info?: AchievementInfo;
  achievement?: Achievement;

  showHint = false;

  constructor(
    private route: ActivatedRoute,
    private achievementService: AchievementService,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      tap(({achievement}) => this.info = this.achievementService.getInfo(achievement)),
      switchMap(({user, achievement}) => this.achievementService.get(user, achievement)),
    ).subscribe(achievement => {
      this.achievement = achievement;
    });
  }

}
