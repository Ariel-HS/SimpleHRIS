import { Column, Entity, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Attendance } from "../../attendance/entities/attendance.entity.js";

@Entity()
export class Photos {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'blob' }) 
    imgSrc: Buffer;

    @Column() mimeType: string;

    @OneToOne(() => Attendance, (attendance) => attendance.photo)
    attendance: Relation<Attendance>;
}