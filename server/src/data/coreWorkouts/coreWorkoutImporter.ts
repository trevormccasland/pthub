import { AppDataSource } from "../../data-source";
import fs from 'fs';
import path from 'path';
import { Exercise } from "../../entity/Exercise.entity";
import { Activity, ActivityType } from "../../entity/Activity.entity";
import { Workout, WorkoutType } from "../../entity/Workout.entity";
import { WorkoutActivity } from "../../entity/WorkoutActivity.entity";
import { ActivityExercise } from "../../entity/ActivityExercise.entity";

// current directory
const directory = __dirname;

function parseSetsReps(str: string): { sets?: number, reps?: number, time?: number, rest?: number, notes?: string } {
    const result: any = {};
    const setsMatch = str.match(/(\d+)\s*x/);
    if (setsMatch) result.sets = parseInt(setsMatch[1]);
    const repsMatch = str.match(/x\s*([\d\-A-Z]+)/);
    if (repsMatch) {
        const repsStr = repsMatch[1];
        if (repsStr.match(/AMGRAP/i)) {
            result.notes = "AMGRAP";
        } else if (repsStr.match(/\d+/)) {
            result.reps = parseInt(repsStr.match(/\d+/)![0]);
        }
    }
    const restMatch = str.match(/Rest\s*(\d+)\s*seconds/);
    if (restMatch) result.rest = parseInt(restMatch[1]);
    result.notes = (result.notes || "") + (str.includes("alt") ? " alternating" : "");
    return result;
}

AppDataSource.initialize().then(async () => {
    const files = fs.readdirSync(directory).filter(f => f.endsWith('.csv'));

    for (const file of files) {
        const csvPath = path.join(directory, file);
        const csv = fs.readFileSync(csvPath, "utf8");
        const lines = csv.split("\n").map(l => l.trim()).filter(l => l.length > 0);
        const header = lines[0].replace(/"/g, '').split(",");
        const rows = lines.slice(1).map(line => {
            const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            return matches ? matches.map(cell => cell.replace(/(^"|"$)/g, "")) : [];
        });

        const exercises: Exercise[] = [];
        const workActivities: Activity[] = [];

        const workoutService = AppDataSource.getRepository(Workout);
        const activityService = AppDataSource.getRepository(Activity);
        const exerciseService = AppDataSource.getRepository(Exercise);
        const workoutActivityService = AppDataSource.getRepository(WorkoutActivity);
        const activityExerciseService = AppDataSource.getRepository(ActivityExercise);

        // We will create and save the workout first, then link activities to it.
        const title = path.basename(file, ".csv")
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const workout = workoutService.create({
            name: `Core - ${title}`,
            sets: null,
            type: WorkoutType.STRAIGHT_SET,
        });

        const newWorkout = await workoutService.save(workout);
        
        // Loop through each row to create and link entities
        const entries = rows.entries();
        for (let i =0; i < rows.length; i++) {
            const [index, row] = entries.next().value;
            const [
                exerciseName,
                classification,
                page,
                week1,
                week2,
                week3,
                easier,
                harder
            ] = row;

            const cleanedName = exerciseName.replace(/^\d+\.\s*/, "");
            
            // 1. Create and save Exercise entity
            const newExercise = exerciseService.create({
                name: cleanedName,
                type: classification,
                notes: `Easier: ${easier}. Harder: ${harder}`,
                ...parseSetsReps(week1)
            });
            await exerciseService.save(newExercise);

            // 2. Create and save Activity entity
            const newActivity = activityService.create({
                name: cleanedName,
                type: ActivityType.TOTAL_BODY,
            });
            await activityService.save(newActivity);

            // 3. Create and save ActivityExercise entity to link Exercise to Activity
            const newActivityExercise = activityExerciseService.create({
                activity: newActivity,
                exercise: newExercise,
                order: 1, // Assuming one exercise per activity, so order is 1
            });
            await activityExerciseService.save(newActivityExercise);

            // 4. Create and save WorkoutActivity entity to link Activity to Workout
            const newWorkoutActivity = workoutActivityService.create({
                workout: newWorkout,
                activity: newActivity,
                phase: 'work', // All activities are 'work' phase in this importer
                order: index, // Use the row index as the order
            });
            await workoutActivityService.save(newWorkoutActivity);
        }

        console.log(`Imported workout, activities, and exercises from ${file}!`);
    }
}).catch(error => console.log(error));