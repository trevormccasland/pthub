import { AppDataSource } from "../data-source"
import { Workout } from "../entity/Workout.entity"

const getWorkouts = async (): Promise<Workout[]> => {
    const workouts = await AppDataSource.getRepository(Workout).find({
        relations: {
            workoutActivities: {
                activity: {
                    group: {
                        exercise: true
                    }
                }
            },
        }
    });

    const phaseOrder = {
        'warmup': 1,
        'work': 2,
        'cooldown': 3
    };

    workouts.forEach(workout => {
        if (workout.workoutActivities) {
            // Sort activities by phase and then by order
            workout.workoutActivities.sort((a, b) => {
                const aPhase = phaseOrder[a.phase];
                const bPhase = phaseOrder[b.phase];

                if (aPhase !== bPhase) {
                    return aPhase - bPhase;
                }

                // If phases are the same, sort by the activity order
                return a.order - b.order;
            });

            // For each activity, sort its exercises by order
            workout.workoutActivities.forEach(workoutActivity => {
                if (workoutActivity.activity?.group) {
                    workoutActivity.activity.group.sort((a, b) => a.order - b.order);
                }
            });
        }
    });

    return workouts;
};

const updateWorkout = async (entity: Workout): Promise<Workout> => {
    return await AppDataSource.getRepository(Workout).save(entity)
}

const createWorkout = async (entity: Workout): Promise<Workout> => {
    const newWorkout = AppDataSource.getRepository(Workout).create(entity)
    return await AppDataSource.getRepository(Workout).save(newWorkout)
}

export default {
    getWorkouts,
    updateWorkout,
    createWorkout
}