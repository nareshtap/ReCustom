import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ActivityLogsService } from 'src/activity-logs/activity-logs.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly activityLogsService: ActivityLogsService
    ) { }

    async getAllUsers(
        page: number,
        limit: number,
        sortBy: string,
        order: 'asc' | 'desc',
        search: string,
    ): Promise<{ data: (User & { logins: number; downloads: number })[]; total: number }> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (search) {
            queryBuilder.where('user.name LIKE :search OR user.email LIKE :search', { search: `%${search}%` });
        }

        queryBuilder.skip((page - 1) * limit).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();

        const usersWithMetrics = await Promise.all(data.map(async (user) => {
            const metrics = await this.activityLogsService.getUserMetrics(user.id);
            return {
                ...user,
                logins: metrics.metrics?.logins ?? 0,
                downloads: metrics.metrics?.downloads ?? 0,
            };
        }));


        if (sortBy === 'logins' || sortBy === 'downloads') {

            usersWithMetrics.sort((a, b) => {
                const aMetric = sortBy === 'logins' ? a.logins : a.downloads;
                const bMetric = sortBy === 'logins' ? b.logins : b.downloads;

                return order === 'asc' ? aMetric - bMetric : bMetric - aMetric;
            });
        } else {

            usersWithMetrics.sort((a, b) => {
                const aField = a[sortBy as keyof User];
                const bField = b[sortBy as keyof User];

                if (typeof aField === 'string' && typeof bField === 'string') {
                    return order === 'asc'
                        ? aField.localeCompare(bField)
                        : bField.localeCompare(aField);
                }


                return order === 'asc' ? aField > bField ? 1 : -1 : bField < aField ? 1 : -1;
            });
        }

        return { data: usersWithMetrics, total };
    }


    async createUser(user: Partial<User>): Promise<User> {
        if (!user.email || !user.name) {
            throw new BadRequestException('User email and name are required');
        }

        const existingUser = await this.userRepository.findOne({ where: { email: user.email } });

        if (existingUser) {
            throw new BadRequestException('Email is already in use');
        }

        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    async updateUser(id: number, user: Partial<User>): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { id } });

        if (!existingUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        await this.userRepository.update(id, user);
        return this.userRepository.findOne({ where: { id } });
    }

    async removeUser(id: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        await this.userRepository.delete(id);
    }
}
