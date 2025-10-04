import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exercise } from "./Exercise.entity";
import { ActivityRecord } from "./ActivityRecord.entity";

@Entity()
export class ExerciseRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text', nullable: true})
    notes: string | null;

    @OneToOne(() => Exercise)
    @JoinColumn()
    exercise: Exercise;

    @Column({type: 'int', nullable: true})
    load: number | null;
    
    @Column({type: 'int', nullable: true})
    time: number | null;

    @Column({type: 'int', nullable: true})
    sets: number | null;

    @ManyToOne(() => ActivityRecord, ar => ar.exerciseRecords)
    @JoinColumn()
    activityRecord: ActivityRecord
}