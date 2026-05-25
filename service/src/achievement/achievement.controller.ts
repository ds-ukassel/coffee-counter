import {Body, Controller, Delete, Get, Param, Patch, Put} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {CreateAchievementDto, UpdateAchievementDto} from './achievement.dto';
import {Achievement} from './achievement.schema';
import {AchievementService} from './achievement.service';

@Controller('users/:userId/achievements')
@ApiTags('Achievements')
export class AchievementController {
	constructor(
		private readonly achievementService: AchievementService,
	) {
	}

	@Get()
	@ApiOkResponse({type: [Achievement]})
	async findAll(
		@Param('userId') userId: string,
	): Promise<Achievement[]> {
		return this.achievementService.findAll({userId});
	}

	@Get(':id')
	@ApiOkResponse({type: Achievement})
	async findOne(
		@Param('userId') userId: string,
		@Param('id') id: string,
	): Promise<Achievement | null> {
		return this.achievementService.findOne({userId, id});
	}

	@Put(':id')
	@ApiOkResponse({type: Achievement})
	async create(
		@Param('userId') userId: string,
		@Param('id') id: string,
		@Body() achievement: CreateAchievementDto,
	): Promise<Achievement> {
		return this.achievementService.award(userId, id, achievement);
	}

	@Patch(':id')
	@ApiOkResponse({type: Achievement})
	async update(
		@Param('userId') userId: string,
		@Param('id') id: string,
		@Body() dto: UpdateAchievementDto,
	): Promise<Achievement | null> {
		return this.achievementService.updateOne({userId, id}, dto);
	}

	@Delete(':id')
	@ApiOkResponse({type: Achievement})
	async delete(
		@Param('userId') userId: string,
		@Param('id') id: string,
	): Promise<Achievement | null> {
		return this.achievementService.deleteOne({userId, id});
	}
}
