import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class ActivityLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    timestamp: Date;

    @ManyToOne(() => User, (user) => user.activityLogs, { onDelete: 'CASCADE' })
    user: User;
}
