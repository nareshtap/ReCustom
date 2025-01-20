import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLogType } from './enum/activity-log-type.enum';

@Injectable()
export class ActivityLogsService {
    constructor(
        @InjectRepository(ActivityLog)
        private readonly activityLogRepository: Repository<ActivityLog>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createLog(userId: number, activityType: ActivityLogType, timestamp: Date): Promise<void> {
        const activityLog = new ActivityLog();
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        }

        activityLog.user = user;
        activityLog.type = activityType;
        activityLog.timestamp = timestamp;

        await this.activityLogRepository.save(activityLog);
    }

    async getUserMetrics(userId: number): Promise<{ user: User; metrics: { logins: number; downloads: number } }> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['activityLogs']
        });

        if (!user) {
            throw new Error('User not found');
        }

        const loginsCount = await this.activityLogRepository.count({
            where: { user: { id: userId }, type: 'login' },
        });

        const downloadsCount = await this.activityLogRepository.count({
            where: { user: { id: userId }, type: 'pdf_download' },
        });

        return {
            user,
            metrics: {
                logins: loginsCount,
                downloads: downloadsCount,
            },
        };
    }
}
