import { Entity, PrimaryGeneratedColumn, Column, JoinTable, OneToMany } from "typeorm"
import { Exercise } from "./Exercise.entity"
import { ActivityExercise } from "./ActivityExercise.entity"

export enum ActivityType {
    SYNERGISTIC = 'synergistic',
    ANTAGONISTIC = 'antagonistic',
    TOTAL_BODY = 'total_body'
}

@Entity()
export class Activity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => ActivityExercise, ae => ae.activity, { cascade: true })
    @JoinTable()
    group: ActivityExercise[]

    @Column({nullable: true})
    type: ActivityType
}