import {
  Body,
  ConflictException,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {CreateUserDto, UpdateUserDto} from './user.dto';
import {User} from './user.schema';
import {UserService} from './user.service';

@Controller('users')
@ApiTags('Users')
export class UserController {
	constructor(
		private userService: UserService,
	) {
	}

	@Get()
	@ApiOkResponse({type: [User]})
	async getUsers(
		@Query('archived', new DefaultValuePipe(false), ParseBoolPipe) archived: boolean,
	): Promise<User[]> {
		return this.userService.findAll({archived: archived ? true : {$ne: true}});
	}

	@Get(':id')
	// TODO @NotFound
	@ApiOkResponse({type: User})
	async getUser(@Param('id') id: string): Promise<User | null> {
		return this.userService.find(id);
	}

	@Post()
	@ApiCreatedResponse({type: User})
	@ApiConflictResponse({type: User, description: 'Username was already taken.'})
	async create(@Body() dto: CreateUserDto): Promise<User> {
		const existing = await this.userService.findAll({name: dto.name});
		if (existing.length) {
			throw new ConflictException('Username already taken');
		}
		return this.userService.create(dto);
	}

	@Patch(':id')
	// TODO @NotFound()
	@ApiOkResponse({type: User})
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateUserDto,
	): Promise<User | null> {
		return this.userService.update(id, dto);
	}

	@Delete(':id')
	// TODO @NotFound()
	@ApiOkResponse({type: User})
	async delete(
		@Param('id') id: string,
	): Promise<User | null> {
		return this.userService.delete(id);
	}
}
