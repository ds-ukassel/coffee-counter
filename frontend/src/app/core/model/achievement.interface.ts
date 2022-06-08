import {TrophyTier} from '../../shared/pipe/trophy-tier.pipe';

export default interface Achievement {
  _id?: string,
  image?: string,
  name: string,
  description: string,
  tier: TrophyTier,
  hint: string,
  receivedAt?: Date,
}
