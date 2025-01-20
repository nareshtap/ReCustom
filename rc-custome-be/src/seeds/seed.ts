import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ActivityLogsService } from 'src/activity-logs/activity-logs.service';
import { ActivityLogType } from 'src/activity-logs/enum/activity-log-type.enum';

@Injectable()
export class UserSeed {
    constructor(
        private readonly userService: UsersService,
        private readonly activityLogsService: ActivityLogsService,
    ) { }

    private getRandomActivityCount(): number {
        return Math.floor(Math.random() * 10) + 1;
    }

    async seed(): Promise<void> {
        const users: Partial<User>[] = [];

        for (let i = 1; i <= 20; i++) {
            const role = i <= 5 ? 'user' : 'admin';
            users.push({
                name: `User ${i}`,
                email: `user${i}@example.com`,
                role,
            });
        }

        for (const user of users) {
            const createdUser = await this.userService.createUser(user);

            const loginsCount = this.getRandomActivityCount();
            const downloadsCount = this.getRandomActivityCount();

            for (let i = 0; i < loginsCount; i++) {
                await this.activityLogsService.createLog(
                    createdUser.id,
                    ActivityLogType.LOGIN,
                    new Date(),
                );
            }

            for (let i = 0; i < downloadsCount; i++) {
                await this.activityLogsService.createLog(
                    createdUser.id,
                    ActivityLogType.PDF_DOWNLOAD,
                    new Date(),
                );
            }
        }
    }
}
