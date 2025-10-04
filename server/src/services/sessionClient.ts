import { AppDataSource } from "../data-source";
import { Session } from "../entity/Session.entity";
import { WorkoutRecord } from "../entity/WorkoutRecord.entity";
import { ActivityRecord } from "../entity/ActivityRecord.entity";
import { ExerciseRecord } from "../entity/ExerciseRecord.entity";
import { DeepPartial } from "typeorm";

export const createSession = async (sessionData: DeepPartial<Session>): Promise<Session> => {
    const sessionRepo = AppDataSource.getRepository(Session);
    const workoutRecordRepo = AppDataSource.getRepository(WorkoutRecord);
    const activityRecordRepo = AppDataSource.getRepository(ActivityRecord);
    const exerciseRecordRepo = AppDataSource.getRepository(ExerciseRecord);

    let workoutRecord: WorkoutRecord | undefined = undefined;
    if (sessionData.workoutRecord) {
        const wrData = sessionData.workoutRecord;

        // 1. Create and save WorkoutRecord first (without activity records)
        workoutRecord = workoutRecordRepo.create({
            notes: wrData.notes,
            workout: wrData.workout,
        });
        await workoutRecordRepo.save(workoutRecord);

        // Helper to create ActivityRecords and ExerciseRecords for a phase
        const createActivityRecords = async (
            activityRecordsData: DeepPartial<ActivityRecord>[] = [],
            workoutRecord: WorkoutRecord,
            phase: "warmup" | "work" | "cooldown"
        ) => {
            const activityRecords: ActivityRecord[] = [];
            for (const arData of activityRecordsData) {
                const activityRecord = activityRecordRepo.create({
                    notes: arData.notes,
                    activity: arData.activity,
                    workoutRecord: workoutRecord,
                    phase,
                });
                await activityRecordRepo.save(activityRecord);

                const exerciseRecords: ExerciseRecord[] = [];
                for (const erData of arData.exerciseRecords || []) {
                    const exerciseRecord = exerciseRecordRepo.create({
                        ...erData,
                        activityRecord: activityRecord,
                    });
                    await exerciseRecordRepo.save(exerciseRecord);
                    exerciseRecords.push(exerciseRecord);
                }

                activityRecord.exerciseRecords = exerciseRecords;
                await activityRecordRepo.save(activityRecord);

                activityRecords.push(activityRecord);
            }
            return activityRecords;
        };

        // Create all activity records for each phase
        workoutRecord.warmupRecords = await createActivityRecords(wrData.warmupRecords, workoutRecord, "warmup");
        workoutRecord.workRecords = await createActivityRecords(wrData.workRecords, workoutRecord, "work");
        workoutRecord.cooldownRecords = await createActivityRecords(wrData.cooldownRecords, workoutRecord, "cooldown");


        // Save WorkoutRecord again with all activity records attached
        await workoutRecordRepo.save(workoutRecord);
    }

    // Create the session with the newly created workoutRecord
    const session = sessionRepo.create({
        ...sessionData,
        workoutRecord,
    });
    return await sessionRepo.save(session);
};

export const getAllSessions = async (): Promise<Session[]> => {
    const repo = AppDataSource.getRepository(Session);
    return await repo.find({
        relations: [
            "reservation",
            "participants",
            "trainer",
            "workoutRecord",
            "workoutRecord.warmupRecords",
            "workoutRecord.warmupRecords.exerciseRecords",
            "workoutRecord.workRecords",
            "workoutRecord.workRecords.exerciseRecords",
            "workoutRecord.cooldownRecords",
            "workoutRecord.cooldownRecords.exerciseRecords",
        ],
    });
}