import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinTable } from "typeorm"
import { User } from "./User.entity"

@Entity()
export class Availability {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    timezone: string

    @Column({type: 'date'})
    date: Date

    @Column({type: 'time'})
    startTime: Date

    @Column({type: 'time'})
    endTime: Date

    @Column({type: 'date', nullable: true})
    repeatUntil: Date
}