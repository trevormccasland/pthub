import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Activity } from "./Activity.entity";
import { ExerciseRecord } from "./ExerciseRecord.entity";
import { WorkoutRecord } from "./WorkoutRecord.entity";

@Entity()
export class ActivityRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text', nullable: true})
    notes: string | null;

    @Column({ type: "varchar" })
    phase: "warmup" | "work" | "cooldown";

    @OneToOne<Activity>(() => Activity)
    @JoinColumn()
    activity: Activity;

    @OneToMany(() => ExerciseRecord, er => er.activityRecord, { cascade: true })
    @JoinColumn()
    exerciseRecords: ExerciseRecord[]

    @ManyToOne(() => WorkoutRecord, wr => wr.workRecords)
    @JoinColumn()
    workoutRecord: WorkoutRecord
}