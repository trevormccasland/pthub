import { AppDataSource } from "../data-source";
import { Session } from "../entity/Session.entity";
import { WorkoutRecord } from "../entity/WorkoutRecord.entity";
import { ActivityRecord } from "../entity/ActivityRecord.entity";
import { ExerciseRecord } from "../entity/ExerciseRecord.entity";
import { DeepPartial } from "typeorm";
import { ActivityExercise } from "../entity/ActivityExercise.entity";

export const createSession = async (sessionData: DeepPartial<Session>): Promise<Session> => {
    const sessionRepo = AppDataSource.getRepository(Session);
    const workoutRecordRepo = AppDataSource.getRepository(WorkoutRecord);
    const activityRecordRepo = AppDataSource.getRepository(ActivityRecord);
    const exerciseRecordRepo = AppDataSource.getRepository(ExerciseRecord);

    let workoutRecord: WorkoutRecord | undefined = undefined;
    if (sessionData.workoutRecord) {
        const wrData = sessionData.workoutRecord;

        // 1. Create ExerciseRecord entities
        const exerciseRecordsPromises = wrData.activityRecords?.flatMap(arData =>
            arData.exerciseRecords?.map(erData =>
                exerciseRecordRepo.create(erData as DeepPartial<ExerciseRecord>)
            ) || []
        ) || [];
        const createdExerciseRecords = await exerciseRecordRepo.save(exerciseRecordsPromises);
        
        // 2. Create ActivityRecord entities and associate them with their ExerciseRecords
        const activityRecordsPromises = wrData.activityRecords?.map(arData => {
            const newAr = activityRecordRepo.create({
                notes: arData.notes,
                phase: arData.phase,
                activity: arData.activity as ActivityExercise, // Correctly associating with ActivityExercise
                exerciseRecords: createdExerciseRecords.splice(0, arData.exerciseRecords?.length || 0)
            });
            return newAr;
        }) || [];
        const createdActivityRecords = await activityRecordRepo.save(activityRecordsPromises);

        // 3. Create WorkoutRecord entity and associate it with the created ActivityRecords
        workoutRecord = workoutRecordRepo.create({
            ...wrData,
            activityRecords: createdActivityRecords
        });
        await workoutRecordRepo.save(workoutRecord);
    }

    // 4. Create the Session entity and associate it with the created WorkoutRecord
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
            "workoutRecord.activityRecords",
            "workoutRecord.activityRecords.activity",
            "workoutRecord.activityRecords.exerciseRecords",
            "workoutRecord.activityRecords.exerciseRecords.exercise",
        ],
    });
};