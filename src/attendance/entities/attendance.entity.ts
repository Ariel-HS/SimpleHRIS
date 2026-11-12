import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Photos } from "../../photos/entities/photos.entity.js";
import { User } from "../../user/entities/user.entity.js";

@Entity()
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.attendances)
    user: User;
    
    @Column()
    date: Date;

    @Column()
    time: string;

    @Column({ default: 'absent' })
    status: 'on-time' | 'late' | 'absent';

    @OneToOne(type => Photos, photo => photo.attendance)
    photo: Photos;
}