import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Activity } from "./Activity.entity";
import { Exercise } from "./Exercise.entity";

@Entity()
export class ActivityExercise {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Activity, activity => activity.group)
    @JoinColumn()
    activity: Activity;

    @ManyToOne(() => Exercise)
    @JoinColumn()
    exercise: Exercise;

    @Column()
    order: number;
}