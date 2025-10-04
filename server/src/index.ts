import workoutController from "./controllers/workoutController";
import { AppDataSource } from "./data-source"
import express from "express";
import { Activity } from "./entity/Activity.entity";
import activityController from "./controllers/activityController";
import cors from 'cors'
import exerciseController from "./controllers/exerciseController";
import userController from "./controllers/userController";
import emailController from "./controllers/emailController";
import availabilityController from "./controllers/availabilityController";
import reservationController from "./controllers/reservationController";
import sessionController from "./controllers/sessionController";
import dotenv from 'dotenv'
dotenv.config()

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
    app.put("/workout", workoutController.updateWorkoutResponse)
    app.post("/workout", workoutController.createWorkoutResponse)

    app.get("/activity", activityController.getActivitiesResponse);
    app.put("/activity", activityController.updateAcitivtyResponse)
    app.post("/activity", activityController.createActivityResponse)

    app.get("/exercise", exerciseController.getExercisesResponse);
    app.put("/exercise", exerciseController.updateExerciseResponse)
    app.post("/exercise", exerciseController.createExerciseResponse)

    app.get("/user", userController.getUsersResponse)
    app.get("/user/:userId", userController.getUserByIdResponse);
    app.put("/user", userController.updateUsersResponse)
    app.post("/user", userController.createUserResponse)

    app.post("/email/send", emailController.sendEmailResponse)

    app.get("/availability/:userId", availabilityController.getUserAvailabilitiesResponse);
    app.get("/availability", availabilityController.getAvailabilitiesResponse);
    app.put("/availability", availabilityController.updateAvailabilityResponse)
    app.post("/availability", availabilityController.createAvailabilityResponse)
    app.delete("/availability", availabilityController.deleteAvailabilityResponse)

    app.post("/reservation", reservationController.createReservationResponse)
    app.get("/reservation", reservationController.getReservationsResponse)
    app.put("/reservation", reservationController.updateReservationResponse)
    app.delete("/reservation", reservationController.deleteReservationResponse)
    
    app.post("/session", sessionController.createSessionResponse)
    app.get("/session", sessionController.getSessionsResponse)
    // Start the Express server
    app.listen(port, () => {
        console.log(`The server is running at http://localhost:${port}`);
    });

}).catch(error => console.log(error))

