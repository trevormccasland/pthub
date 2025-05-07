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
    load?: number | null,
    url?: string
    sets?: number | null
    reps?: number | null
    time?: number | null
    rest?: number | null
    tempo?: [number, number, number, number] | null,
    notes?: string | null
}

export interface Activity {
    name: string
    type: SetType
    group: Exercise[]
}

export interface Workout {
    name: string
    sets?: number | null
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

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    TRAINER = 'TRAINER'
}

export interface User {
    id?: number
    email: string
    firstName: string
    lastName: string
    role: UserRole
    isActive: boolean
    clients: User[]
    instagramHandle: string | null
}

export type Page = 'trainers' | 'signup' | 'clients' | 'profile' | 'assignments' | 'default' | 'login' | 'workout' | 'exercise' | 'activity' 