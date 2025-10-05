import { AppDataSource } from "../../data-source";
import fs from 'fs';
import path from 'path';
import { Exercise } from "../../entity/Exercise.entity";
import { Activity, ActivityType } from "../../entity/Activity.entity";
import { Workout, WorkoutType } from "../../entity/Workout.entity";

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
        const activities: Activity[] = [];
        const warmup: Activity[] = [];
        const work: Activity[] = [];
        const cooldown: Activity[] = [];

        for (const row of rows) {
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

            const exerciseService = AppDataSource.getRepository(Exercise);
            const cleanedName = exerciseName.replace(/^\d+\.\s*/, "");
            const exercise = exerciseService.create({
                name: cleanedName,
                type: classification,
                notes: `Easier: ${easier}. Harder: ${harder}`,
                ...parseSetsReps(week1)
            });
            await AppDataSource.manager.save(exercise);
            exercises.push(exercise);

            const activityService = AppDataSource.getRepository(Activity);
            const activity = activityService.create({
                name: cleanedName,
                type: ActivityType.TOTAL_BODY,
                group: [exercise]
            });
            await AppDataSource.manager.save(activity);
            activities.push(activity);

            work.push(activity);
        }

        const workoutService = AppDataSource.getRepository(Workout);
        const title = path.basename(file, ".csv")
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        const workout = workoutService.create({
            name: `Core - ${title}`,
            sets: null,
            type: WorkoutType.STRAIGHT_SET,
            warmup,
            work,
            cooldown
        });
        await AppDataSource.manager.save(workout);

        console.log(`Imported workout, activities, and exercises from ${file}!`);
    }
});