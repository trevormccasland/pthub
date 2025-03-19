import { AppDataSource } from "../data-source"
import { Exercise } from "../entity/Exercise.entity"

const getExercises = async (): Promise<Exercise[]> => {
    return  await AppDataSource.getRepository(Exercise).find()
}

export default {
    getExercises
}