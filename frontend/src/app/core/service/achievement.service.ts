import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TrophyTier} from '../../shared/pipe/trophy-tier.pipe';
import {Achievement, AchievementInfo} from '../model/achievement.interface';

export const achievements: AchievementInfo[] = [
  {
    id: 'night-owl',
    image: '/assets/trophies/nightOwl.svg',
    name: 'Night Owl',
    description: 'Late at night, when everybody is sleeping, it\'s only you, your PC and your coffee.',
    tier: TrophyTier.bronze,
    hint: 'Register a Coffee between 8PM and 5AM',
  },
  {
    id: 'early-bird',
    image: '/assets/trophies/earlyBird.svg',
    name: 'Early Bird',
    description: 'The early bird catches the worm, or as a software engineer would say: "Was eine unheilige Zeit. Erstmal nen Kaffe!"',
    tier: TrophyTier.bronze,
    hint: 'Register a Coffee between 5AM and 8AM',
  },
  {
    id: 'most-addicted',
    image: '/assets/trophies/mostAddictedOfThemAll.svg',
    name: 'Most Addicted',
    description: 'One coffee to rule them all, one coffee to find them, One coffee to bring them all, and in the darkness bind them.',
    tier: TrophyTier.platinum,
    hint: 'Have more coffees registered as any other user',
  },
  {
    id: 'buyer-of-milk',
    image: '/assets/trophies/buyerOfMilk.svg',
    name: 'Buyer of Milk',
    description: 'Milk is good for your bones! - Skeletor',
    tier: TrophyTier.silver,
    hint: 'Register 5 milk purchases',
    goal: 5,
  },
  {
    id: 'buyer-of-non-milk',
    image: '/assets/trophies/buyerOfNoMilk.svg',
    name: 'Buyer of Non-Milk',
    description: 'By the way, i\'m vegan - Every vegan, ever',
    tier: TrophyTier.silver,
    hint: 'Register 5 milk-alternative purchases',
    goal: 5,
  },
  {
    id: 'buyer-of-coffee',
    image: '/assets/trophies/buyerOfCoffee.svg',
    name: 'Buyer of Coffee',
    description: 'In germany we call it: "Irgendwer muss ja den Laden am Laufen halten."',
    tier: TrophyTier.gold,
    hint: 'Register 10 coffee purchases',
    goal: 10,
  },
];

@Injectable({
  providedIn: 'root',
})
export class AchievementService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getAll(user: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${environment.apiUrl}/users/${user}/achievements`);
  }

  get(user: string, id: string): Observable<Achievement> {
    return this.http.get<Achievement>(`${environment.apiUrl}/users/${user}/achievements/${id}`);
  }

  getInfo(id: string): AchievementInfo {
    return achievements.find(achievementInfo => achievementInfo.id === id) ?? {
      id,
      name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      description: 'This achievement keeps an ominous aura of mystery around it 🔮✨',
      hint: 'The inner machinations of my mind are an enigma 🥛🫗',
      image: '/assets/trophies/mystery.svg',
      tier: TrophyTier.silver,
    };
  }
}
