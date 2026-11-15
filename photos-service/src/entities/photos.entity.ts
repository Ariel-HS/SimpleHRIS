import { Column, Entity, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";

@Entity()
export class Photos {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'blob' }) 
    imgSrc: Buffer;

    @Column() mimeType: string;
}