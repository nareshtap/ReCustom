import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ActivityLogsModule,
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule { }
