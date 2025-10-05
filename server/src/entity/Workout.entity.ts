import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { WorkoutActivity } from "./WorkoutActivity.entity"

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

    @OneToMany(() => WorkoutActivity, wa => wa.workout, { cascade: true })
    workoutActivities: WorkoutActivity[];
}