import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Exercise } from "./Exercise.entity"

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

    @ManyToMany(() => Exercise)
    @JoinTable()
    group: Exercise[]

    @Column({nullable: true})
    type: ActivityType
}