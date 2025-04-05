import { AppDataSource } from "../data-source"
import { Workout } from "../entity/Workout.entity"

const getWorkouts = async (): Promise<Workout[]> => {
    return  await AppDataSource.getRepository(Workout).find({
        relations: {
            warmup: {
                group: true
            },
            work: {
                group: true
            },
            cooldown: {
                group: true
            }
        }
    })
}

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