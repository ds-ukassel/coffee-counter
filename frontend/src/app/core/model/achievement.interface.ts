import {TrophyTier} from '../../shared/pipe/trophy-tier.pipe';

export interface Achievement {
  id: string;
  progress: number;
  unlockedAt?: Date;
}

export type CreateAchievementDto = Omit<Achievement, 'id' | 'userId'>;
export type UpdateAchievementDto = Partial<CreateAchievementDto>;

export interface AchievementInfo {
  id: string;
  image: string,
  name: string,
  description: string,
  tier: TrophyTier,
  hint: string,
  goal?: number;
}
