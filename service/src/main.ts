import {ValidationPipe} from '@nestjs/common';
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
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalGuards(new ApiKeyGuard());

	const config = new DocumentBuilder()
		.setTitle('Coffee Counter Ultimate')
		.setVersion(environment.version)
		.addBearerAuth()
		.addServer(`http://localhost:${environment.port}`, 'Local')
		.addServer('https://coffee.uniks.de', 'Production')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(prefix, app, document);

	await app.listen(environment.port);
}

bootstrap();
