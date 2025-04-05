import { Request, Response } from "express";
import { Exercise } from "../entity/Exercise.entity";
import exerciseClient from "../services/exerciseClient";
import { AppDataSource } from "../data-source";

interface ExerciseListResponse {
    exercises: Exercise[]
}

interface ExerciseResponse {
    exercise: Exercise
}

const getExercisesResponse = async (req: Request, res: Response<ExerciseListResponse>) => {
    const exercises = await exerciseClient.getExercises()
    res.json({ exercises });
}

const updateExerciseResponse = async (req: Request, res: Response<ExerciseResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(Exercise, body)
    const exercise = await exerciseClient.updateExercise(entity)
    res.json({exercise})
}

const createExerciseResponse = async (req: Request, res: Response<ExerciseResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(Exercise, body)
    const exercise = await exerciseClient.createExercise(entity)
    res.json({exercise})
}

export default {
    getExercisesResponse,
    updateExerciseResponse,
    createExerciseResponse
}