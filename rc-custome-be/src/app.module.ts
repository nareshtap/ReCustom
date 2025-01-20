import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { User } from './users/entities/user.entity';
import { ActivityLog } from './activity-logs/entities/activity-log.entity';
import { PdfModule } from './pdf/pdf.module';
import { PdfService } from './pdf/pdf.service';
import { PdfController } from './pdf/pdf.controller';
import { UserSeed } from './seeds/seed';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.PG_HOST,
            port: Number(process.env.PG_PORT),
            username: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: 'recustome',
            entities: [User, ActivityLog],
            synchronize: true,
        }),
        UsersModule,
        ActivityLogsModule,
        PdfModule,
    ],
    controllers: [AppController, PdfController],
    providers: [AppService, PdfService, UserSeed, {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
    },],
})
export class AppModule { }
