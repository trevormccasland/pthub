import { Request, Response } from "express";
import workoutClient from "../services/workoutClient";
import { Workout } from "../entity/Workout.entity";
import { AppDataSource } from "../data-source";

interface WorkoutsResponse {
    workouts: Workout[]
}

interface WorkoutResponse {
    workout: Workout
}

const getWorkoutsResponse = async (req: Request, res: Response<WorkoutsResponse>) => {
    const workouts = await workoutClient.getWorkouts()
    res.json({ workouts });
}

const updateWorkoutResponse = async (req: Request, res: Response<WorkoutResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(Workout, body)
    const workout = await workoutClient.updateWorkout(entity)
    res.json({ workout })
}

const createWorkoutResponse = async (req: Request, res: Response<WorkoutResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(Workout, body)
    const workout = await workoutClient.createWorkout(entity)
    res.json({ workout })
}

export default {
    getWorkoutsResponse,
    updateWorkoutResponse,
    createWorkoutResponse
}