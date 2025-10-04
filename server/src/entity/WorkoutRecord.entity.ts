import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ActivityRecord } from "./ActivityRecord.entity";
import { Workout } from "./Workout.entity";

@Entity()
export class WorkoutRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text', nullable: true})
    notes: string | null;

    @OneToOne<Workout>(() => Workout)
    @JoinColumn()
    workout: Workout;

    @OneToMany(() => ActivityRecord, ar => ar.workoutRecord, { cascade: true })
    @JoinColumn()
    warmupRecords: ActivityRecord[];

    @OneToMany(() => ActivityRecord, ar => ar.workoutRecord, { cascade: true })
    @JoinColumn()
    workRecords: ActivityRecord[];

    @OneToMany(() => ActivityRecord, ar => ar.workoutRecord, { cascade: true })
    @JoinColumn()
    cooldownRecords: ActivityRecord[];
}
