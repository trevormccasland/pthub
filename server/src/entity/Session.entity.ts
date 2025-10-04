import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { WorkoutRecord } from "./WorkoutRecord.entity";
import { Reservation } from "./Reservation.entity";

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text', nullable: true})
    notes: string | null;

    @OneToOne<Reservation>(() => Reservation)
    @JoinColumn()
    reservation: Reservation;

    @ManyToMany<User>(() => User)
    @JoinTable()
    participants: User[]

    @OneToOne<User>(() => User)
    @JoinColumn()
    trainer: User

    @OneToOne<WorkoutRecord>(() => WorkoutRecord)
    @JoinColumn()
    workoutRecord: WorkoutRecord
}