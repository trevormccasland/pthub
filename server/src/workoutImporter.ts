import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx'
import { Workout } from './entity/Workout.entity';
import { AppDataSource } from './data-source';
import { Exercise } from './entity/Exercise.entity';
import { Activity } from './entity/Activity.entity';


const directory = 'C:\\Users\\trevo\\Documents\\workouts'

const parseTime = (value) => {
    if (value.includes('Hold')) {
        value = value.replace('Hold', '').trim()
    }
    if (value === 'and see how you do' || value.includes('just give it a shot')) {
        return null
    }
    if (value.includes('Failure')) {
        return 9000
    }
    if (value.includes('all')) {
        return parseInt(value.replace('all', '').trim().split(' ')[0].split('-')[0])
    }
    if (value.includes('sec each side')) {
        return parseInt(value.replace('sec each side', '').trim().split(' ')[0].split('-')[0])
    }
    if (value.includes('min each side')) {
        return parseInt(value.replace('min each side', '').trim()) * 60
    }
    if (value.includes('sec') && value.includes('min')) {
        return parseInt(value.split('-')[0].split(' ')[0])
    }
    if (value.includes('m')) {
        return parseInt(value.replace('m', '').trim()) * 60
    }
    if (value.includes('mins')) {
        return parseInt(value.replace('mins', '').trim()) * 60
    }
    if (value.includes('s')) {
        return parseInt(value.replace('s', '').trim())
    }
    if (value.includes('sec')) {
        return parseInt(value.replace('sec', '').trim())
    }
    if (value.includes('secs')) {
        return parseInt(value.replace('secs', '').trim())
    }
    if (value.includes('each side')) {
        return parseInt(value.replace('each side', '').trim())
    }
    return 0
}

const parseRest = (value) => {
    if (value.includes('-')) {
        return parseInt(value.split('-')[0])
    }
    if (value.includes('as needed')) {
        return -1
    }
    if (value.includes('sec')) {
        return parseInt(value.replace('sec', '').trim())
    }
    if (value.includes('secs')) {
        return parseInt(value.replace('secs', '').trim())
    }
    return -1
}

const getExercise = (sheet, startIndex, count) => {
        const repsKey = 'B'
        const setsKey = `C`
        const tempoKey = `D`
        const restKey = `E`
        const notesKey = `F`
        const hasSets = `${setsKey}${startIndex + count}` in sheet
        const hasRest = `${restKey}${startIndex + count}` in sheet
        const hasReps = `${repsKey}${startIndex + count}` in sheet
        const hasTempo = `${tempoKey}${startIndex + count}` in sheet
        const hasNotes = `${notesKey}${startIndex + count}` in sheet
        
        const isTime = hasReps && !Number.isInteger(sheet[`${repsKey}${startIndex + count}`]['v']) && sheet[`${repsKey}${startIndex + count}`]['v'].includes('Hold')
        const isReps = !isTime && hasReps && (Number.isInteger(sheet[`${repsKey}${startIndex + count}`]['v']) || ['reps', 'rotations', 'forward', 'backward', 'side'].some(k => sheet[`${repsKey}${startIndex + count}`]['v'].includes(k)))
        const hasUrl = 'l' in sheet[`A${startIndex + count}`]
        return {
            name: sheet[`A${startIndex + count}`]['v'],
            ...(hasReps && isReps && { reps: Number.isInteger(sheet[`${repsKey}${startIndex + count}`]['v']) ? sheet[`${repsKey}${startIndex + count}`]['v'] : parseInt(sheet[`${repsKey}${startIndex + count}`]['v'].split(' ')[0]) }),
            ...(hasReps && !isReps && { time: parseTime(sheet[`${repsKey}${startIndex + count}`]['v']) }),
            ...(hasSets && { sets: parseInt(sheet[`${setsKey}${startIndex + count}`]['v']) }),
            ...(hasRest && { rest: parseRest(sheet[`${restKey}${startIndex + count}`]['v']) }),
            ...(hasNotes && { notes: sheet[`${notesKey}${startIndex + count}`]['v'] + (hasTempo ? `, tempo ${sheet[`${tempoKey}${startIndex + count}`]['v']}` : '')}),
            ...(hasUrl && { url: sheet[`A${startIndex + count}`]['l']['Rel']['Target']})
        }
}

AppDataSource.initialize().then(async () => {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(async (file, i) => {
            if (path.extname(file) === '.xlsx') {
                const filePath = path.join(directory, file);
                const excelBook = XLSX.readFile(filePath)
                // It's always one sheet with the default sheet name
                const sheet = excelBook.Sheets['Sheet1']
                const workoutName = file.split('.')[0]
                const workoutType = sheet['A1']['v']
                const workoutGoal = sheet['A3']['v']
                
                // Get warm up exercises
                const warmupIndex = 6
                let bodyIndex = -1
                let count = 0
                const warmUpExercises = []
                while (bodyIndex === -1 && count < 50) {
                    count += 1
                    if (!(`A${warmupIndex + count}` in sheet)){
                        continue
                    }
                    if (['Body', 'Body (work)', 'Body (Work)'].some(v => v === sheet[`A${warmupIndex + count}`]['v'])) {
                        bodyIndex = warmupIndex + count
                    } else if (sheet[`A${warmupIndex + count}`]['v'].length) {
                        warmUpExercises.push(getExercise(sheet, warmupIndex, count))
                    }
                }

                // Get work exercises
                // Strength lower body 2 is failing?
                count = 0
                let coolDownIndex = -1
                const workExercises = []
                while (coolDownIndex === -1 && count < 50) {
                    count += 1
                    if (!(`A${bodyIndex + count}` in sheet)){
                        continue
                    }
                    if (sheet[`A${bodyIndex + count}`]['v'] === 'Cool down') {
                        coolDownIndex = bodyIndex + count
                    } else if (sheet[`A${bodyIndex + count}`]['v'].length) {
                        workExercises.push(getExercise(sheet, bodyIndex, count))
                    }
                }

                // Get cool down exercises
                count = 0
                const coolDownExericses = []
                while(sheet[`A${coolDownIndex + count + 1}`] && sheet[`A${coolDownIndex + count + 1}`]['v'].length && count < 50) {
                    count += 1
                    coolDownExericses.push(getExercise(sheet, coolDownIndex, count))
                }

                console.log({ workoutName, workoutType, workoutGoal, warmUpExercises, workExercises, coolDownExericses})

                
                // Create Activities/Entities, and Write to DB
                const exerciseServce = AppDataSource.getRepository(Exercise)
                const warmupExerciseEntities = await exerciseServce.save(warmUpExercises)
                const activityService = AppDataSource.getRepository(Activity)
                const warmupActivities = warmupExerciseEntities.map( e => ({
                    name: `${e.name}`,
                    group: [e]
                }))
                const warmupActivityEntities = await activityService.save(warmupActivities)
                const workExerciseEntities = await exerciseServce.save(workExercises)
                const workActivities = workExerciseEntities.map( e => ({
                    name: `${e.name}`,
                    group: [e]
                }))
                const workActivityEntities = await activityService.save(workActivities)

                const coolDownExerciseEntities = await exerciseServce.save(coolDownExericses)
                const coolDownActivities = coolDownExerciseEntities.map( e => ({
                    name: `${e.name}`,
                    group: [e]
                }))
                const coolDownActivityEntities = await activityService.save(coolDownActivities)
                const workout = new Workout()
                workout.name = workoutName
                workout.type = workoutType
                workout.sets = 1
                workout.warmup = warmupActivityEntities
                workout.work = workActivityEntities
                workout.cooldown = coolDownActivityEntities
                const workoutService = AppDataSource.getRepository(Workout)
                await workoutService.save(workout)
                console.log('Done!')
            }
        })
    })
})
