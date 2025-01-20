import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ActivityLog } from '../../activity-logs/entities/activity-log.entity';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @Length(2, 100)
    name: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsEnum(['Admin', 'User'])
    role: string;

    @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
    activityLogs: ActivityLog[];
}
