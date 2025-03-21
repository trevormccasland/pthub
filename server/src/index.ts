import workoutController from "./controllers/workoutController";
import { AppDataSource } from "./data-source"
import express, { Request, Response } from "express";
import { Activity, ActivityType } from "./entity/Activity.entity";
import { Exercise } from "./entity/Exercise.entity";
import { Workout, WorkoutType } from "./entity/Workout.entity";
import activityController from "./controllers/activityController";
import cors from 'cors'
import exerciseController from "./controllers/exerciseController";

// Create a new express application instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;

AppDataSource.initialize().then(async () => {
    console.log("Loading activities from the database...")
    const activities = await AppDataSource.manager.find(Activity)
    console.log("Loaded activities: ", activities)

    // Define the root path with a greeting message
    app.use(express.json())
    app.use(cors())
    app.get("/workout", workoutController.getWorkoutsResponse);
    app.get("/activity", activityController.getActivitiesResponse);
    app.get("/exercise", exerciseController.getExercisesResponse)
    app.put("/exercise", exerciseController.updateExerciseResponse)
    app.put("/activity", activityController.updateAcitivtyResponse)
    // Start the Express server
    app.listen(port, () => {
        console.log(`The server is running at http://localhost:${port}`);
    });

}).catch(error => console.log(error))

