import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ActivityRecord } from "./ActivityRecord.entity";
import { WorkoutActivity } from "./WorkoutActivity.entity";

@Entity()
export class WorkoutRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text', nullable: true})
    notes: string | null;

    @OneToOne<WorkoutActivity>(() => WorkoutActivity)
    @JoinColumn()
    workout: WorkoutActivity;

    @OneToMany(() => ActivityRecord, ar => ar.workoutRecord, { cascade: true })
    @JoinColumn()
    activityRecords: ActivityRecord[];
}
