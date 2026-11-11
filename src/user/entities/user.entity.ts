import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Attendance } from "../../attendance/entities/attendance.entity.js";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: 'admin' | 'staff';

    @OneToMany(type => Attendance, attendance => attendance.user)
    attendances: Attendance[];
}
