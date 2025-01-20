import { Controller, Get, Param } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { User } from '../users/entities/user.entity';

@Controller('activity-logs')
export class ActivityLogsController {
    constructor(private readonly activityLogsService: ActivityLogsService) { }

    @Get(':userId')
    async findByUser(@Param('userId') userId: number): Promise<{ user: User; metrics: { logins: number; downloads: number } }> {
        return this.activityLogsService.getUserMetrics(userId);
    }
}
