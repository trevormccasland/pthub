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

    // console.log("Inserting a new user into the database...")
    // const touchDownSquatExercise = new Exercise()
    // touchDownSquatExercise.name = 'touch down squat'
    // touchDownSquatExercise.level = 'stabilization'
    // touchDownSquatExercise.type = 'balance'
    // touchDownSquatExercise.reps = 10
    // touchDownSquatExercise.sets = 3
    // touchDownSquatExercise.rest = 30
    // touchDownSquatExercise.tempo = '2-0-1-0'
    // touchDownSquatExercise.url = 'https://www.youtube.com/watch?v=h6lET2_DLA0'
    // await AppDataSource.manager.save(touchDownSquatExercise)
    // const gobletSquatExercise = new Exercise()
    // gobletSquatExercise.name = 'goblet squat'
    // gobletSquatExercise.level = 'stabilization'
    // gobletSquatExercise.type = 'balance'
    // gobletSquatExercise.load = 30
    // gobletSquatExercise.reps = 10
    // gobletSquatExercise.sets = 3
    // gobletSquatExercise.rest = 30
    // gobletSquatExercise.tempo = '2-0-1-0'
    // await AppDataSource.manager.save(gobletSquatExercise)
    // const walkExercise = new Exercise()
    // walkExercise.name = 'walking'
    // walkExercise.level = 'stabilization'
    // walkExercise.type = 'cardio'
    // walkExercise.time = 300
    // walkExercise.sets = 1
    // await AppDataSource.manager.save(walkExercise)
    // const singleArmKettleBellMarchExercise = new Exercise()
    // singleArmKettleBellMarchExercise.name = 'single arm kettlebell march'
    // singleArmKettleBellMarchExercise.level = 'stabilization'
    // singleArmKettleBellMarchExercise.type = 'balance'
    // singleArmKettleBellMarchExercise.load = 15
    // singleArmKettleBellMarchExercise.time = 30
    // singleArmKettleBellMarchExercise.rest = 30
    // singleArmKettleBellMarchExercise.sets = 1
    // await AppDataSource.manager.save(singleArmKettleBellMarchExercise)
    // const warmupActivity = new Activity()
    // warmupActivity.name = 'squat warmup'
    // warmupActivity.group = [singleArmKettleBellMarchExercise]
    // warmupActivity.type = ActivityType.TOTAL_BODY
    // await AppDataSource.manager.save(warmupActivity)
    // const gluteWorkActivity = new Activity()
    // gluteWorkActivity.name = 'glute superset work'
    // gluteWorkActivity.group = [touchDownSquatExercise, gobletSquatExercise]
    // gluteWorkActivity.type = ActivityType.SYNERGISTIC
    // await AppDataSource.manager.save(gluteWorkActivity)
    // const cooldownActivity = new Activity()
    // cooldownActivity.name = 'walking'
    // cooldownActivity.group = [walkExercise]
    // cooldownActivity.type = ActivityType.TOTAL_BODY
    // await AppDataSource.manager.save(cooldownActivity)
    // const workout = new Workout()
    // workout.name = 'leg workout'
    // workout.sets = 1
    // workout.type = WorkoutType.STRAIGHT_SET
    // workout.warmup = [warmupActivity]
    // workout.work = [gluteWorkActivity]
    // workout.cooldown = [cooldownActivity]
    // await AppDataSource.manager.save(workout)
    console.log("Loading activities from the database...")
    const activities = await AppDataSource.manager.find(Activity)
    console.log("Loaded activities: ", activities)

    // Define the root path with a greeting message
    app.use(cors())
    app.get("/workout", workoutController.getWorkoutsResponse);
    app.get("/activity", activityController.getActivitiesResponse);
    app.get("/exercise", exerciseController.getExercisesResponse)

    // Start the Express server
    app.listen(port, () => {
        console.log(`The server is running at http://localhost:${port}`);
    });

}).catch(error => console.log(error))

