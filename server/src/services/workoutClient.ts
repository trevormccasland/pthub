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

export default {
    getWorkouts,
    updateWorkout
}