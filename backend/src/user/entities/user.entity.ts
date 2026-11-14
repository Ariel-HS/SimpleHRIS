import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, type Relation } from "typeorm";
import { Attendance } from "../../attendance/entities/attendance.entity.js";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: 'admin' | 'staff';

    @OneToMany(() => Attendance, (attendance) => attendance.user)
    @JoinColumn()
    attendances: Relation<Attendance[]>;
}
