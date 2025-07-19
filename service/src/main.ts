import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ApiKeyGuard} from './api-key.guard';
import {AppModule} from './app.module';
import {environment} from './environment';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const prefix = `/api/${environment.version}`;
	app.enableCors();
	app.setGlobalPrefix(prefix);
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidUnknownValues: true,
	}));
	app.useGlobalGuards(new ApiKeyGuard());

	const config = new DocumentBuilder()
		.setTitle('Coffee Counter Ultimate')
		.setVersion(environment.version)
		.addApiKey({
			type: 'apiKey',
			in: 'header',
			name: 'X-Api-Key',
		}, 'api-key')
		.addSecurityRequirements('api-key', [])
		.addServer(`http://localhost:${environment.port}`, 'Local')
		.addServer('https://coffee.uniks.de', 'Production')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(prefix, app, document);

	await app.listen(environment.port);
}

bootstrap().catch((err: Error) => Logger.error(`Error during bootstrap: ${err.message}`, err.stack));
