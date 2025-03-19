import { Request, Response } from "express";
import { Exercise } from "../entity/Exercise.entity";
import exerciseClient from "../services/exerciseClient";

interface ExerciseResponse {
    exercises: Exercise[]
}

const getExercisesResponse = async (req: Request, res: Response<ExerciseResponse>) => {
    const exercises = await exerciseClient.getExercises()
    res.json({ exercises });
}

export default {
    getExercisesResponse
}