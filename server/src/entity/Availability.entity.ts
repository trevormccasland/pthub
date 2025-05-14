import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne } from "typeorm"
import { Reservation } from "./Reservation.entity"
import { User } from "./User.entity"
import { timezoneTransformer } from "./transformers"


@Entity()
export class Availability {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    timezone: string

    @Column()
    dayOfWeek: number

    @Column({type: 'timestamp', transformer: timezoneTransformer()})
    startTime: Date

    @Column({type: 'timestamp', transformer: timezoneTransformer()})
    endTime: Date

    @Column({type: 'timestamp', transformer: timezoneTransformer()})
    startDate: Date

    @Column({type: 'timestamp', nullable: true, transformer: timezoneTransformer()})
    repeatUntil: Date

    @OneToMany<Reservation>(() => Reservation, reservation => reservation.availability)
    @JoinColumn()
    reservations: Reservation[]

    @Column({ nullable: true })
    userId: number

    @ManyToOne(() => User, user => user.availabilities, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User
}