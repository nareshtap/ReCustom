import { Module } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityLog, User])],
    providers: [ActivityLogsService],
    controllers: [ActivityLogsController],
    exports: [ActivityLogsService],
})
export class ActivityLogsModule { }
