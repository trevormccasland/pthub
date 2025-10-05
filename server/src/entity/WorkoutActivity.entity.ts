import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./Workout.entity";
import { Activity } from "./Activity.entity";

@Entity()
export class WorkoutActivity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Workout, workout => workout.workoutActivities)
    @JoinColumn()
    workout: Workout;

    @ManyToOne(() => Activity)
    @JoinColumn()
    activity: Activity;

    @Column()
    phase: 'warmup' | 'work' | 'cooldown';

    @Column()
    order: number; // use order to sort within each phase.
}