import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, type Relation } from "typeorm";
import { Photos } from "../../photos/entities/photos.entity.js";
import { User } from "../../user/entities/user.entity.js";

@Entity()
@Unique(['user', 'date'])  
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.attendances)
    user: Relation<User>;
    
    @Column({ type: 'varchar2', length: 10 })   // 'YYYY-MM-DD'
    date: string;

    @Column({ type: 'varchar2', length: 8 })    // 'HH:mm:SS' (24h)
    time: string;

    @Column({ default: 'absent' })
    status: 'on-time' | 'late' | 'absent';

    @OneToOne(() => Photos, (photo) => photo.attendance, { cascade: true })
    @JoinColumn()
    photo: Relation<Photos>;
}