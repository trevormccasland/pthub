import { Request, Response } from "express";
import workoutClient from "../services/workoutClient";
import { Workout } from "../entity/Workout.entity";

interface WorkoutResponse {
    workouts: Workout[]
}

const getWorkoutsResponse = async (req: Request, res: Response<WorkoutResponse>) => {
    const workouts = await workoutClient.getWorkouts()
    res.json({ workouts });
}

export default {
    getWorkoutsResponse
}