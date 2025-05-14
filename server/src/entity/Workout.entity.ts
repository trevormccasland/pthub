import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from "typeorm"
import { Activity } from "./Activity.entity"

export enum WorkoutType {
    CIRCUIT = 'circuit',
    STRAIGHT_SET = 'straight set'
}

@Entity()
export class Workout {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({nullable: true})
    sets: number

    @Column({nullable: true })
    type: WorkoutType

    @ManyToMany<Activity>(() => Activity)
    @JoinTable()
    warmup: Activity[]

    @ManyToMany<Activity>(() => Activity)
    @JoinTable()
    work: Activity[]

    @ManyToMany<Activity>(() => Activity)
    @JoinTable()
    cooldown: Activity[]
}