import { AppDataSource } from "../data-source"
import { Exercise } from "../entity/Exercise.entity"

const getExercises = async (): Promise<Exercise[]> => {
    return  await AppDataSource.getRepository(Exercise).find()
}

const updateExercise = async (exercise: Exercise): Promise<Exercise> => {
    return await AppDataSource.getRepository(Exercise).save(exercise)
}

export default {
    getExercises,
    updateExercise
}