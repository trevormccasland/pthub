export type ExericseType = 'flexibility' | 'core' | 'resistance' | 'balance' | 'plyometric' | 'cardio'
export type OptModelLevel = 'stabilization' | 'strength' | 'power' 
export type SetType = 'synergistic' | 'antagonistic' | 'total body'
export type WorkoutType = 'circuit' | 'straight set'

export interface Activity {

}

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

export interface Activity {
    name: string
    type: SetType
    group: Exercise[]
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