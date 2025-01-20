import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { UserSeed } from './seed';

async function runSeed() {
    const app = await NestFactory.create(AppModule);
    const userSeed = app.get(UserSeed);
    await userSeed.seed();
    console.log('Seeding complete');
    await app.close();
}

runSeed();
