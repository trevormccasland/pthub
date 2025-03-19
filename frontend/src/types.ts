export type ExericseType = 'flexibility' | 'core' | 'resistance' | 'balance' | 'plyometric' | 'cardio'
export type OptModelLevel = 'stabilization' | 'strength' | 'power' 
export type SetType = 'synergistic' | 'antagonistic' | 'total body'
export type WorkoutType = 'circuit' | 'straight set'

export interface Exercise {
    name: string
    level: OptModelLevel
    type: ExericseType
    load?: number,
    url?: string
    sets?: number
    reps?: number
    time?: number
    rest?: number
    tempo?: [number, number, number, number],
    notes?: string
}

export interface Superset {
    type: SetType
    group: [Exercise, Exercise]
}

export interface Triset {
    type: SetType
    group: [Exercise, Exercise, Exercise]
}

export interface Quadset {
    type: SetType
    group: [Exercise, Exercise, Exercise, Exercise]
}

export type Activity = Exercise | Superset | Triset | Quadset

export const isExercise = (activity: Activity): activity is Exercise => {
    return (<Exercise>activity).name !== undefined
}

export const isSuperset = (activity: Activity): activity is Superset => {
    return (<Superset>activity).group !== undefined && (<Superset>activity).group.length === 2
}

export interface Workout {
    name: string
    sets?: number
    type: WorkoutType
    warmup: Array<Activity>
    work: Array<Activity>
    cooldown: Array<Activity>
}

export interface Subject {
    name: string
    weight: number
    height: number
    sex: 'male' | 'female'
}

export interface SubjectExercise {
    exercise: Exercise
    subject: Subject
    weight: number
}