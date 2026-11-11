import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Attendance } from "../../attendance/entities/attendance.entity.js";

@Entity()
export class Photos {
    @PrimaryGeneratedColumn() 
    id: string;

    @Column() 
    userId!: string;

    @Column() 
    path: string;

    @Column() mimeType: string;

    @Column() 
    sizeBytes: number;

    @OneToOne(type => Attendance, attendance => attendance.photo)
    attendance: Attendance;
}