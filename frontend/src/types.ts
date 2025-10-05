export type ExericseType = 'flexibility' | 'core' | 'resistance' | 'balance' | 'plyometric' | 'cardio'
export type OptModelLevel = 'stabilization' | 'strength' | 'power' 
export type SetType = 'synergistic' | 'antagonistic' | 'total body'
export type WorkoutType = 'circuit' | 'straight set'

export interface Exercise {
    id?: number
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
    id?: number
    name: string
    type: SetType
    group: ActivityExercise[]
}

export interface WorkoutActivity {
    id?: number;
    activity: Activity;
    order: number;
    phase: "warmup" | "work" | "cooldown";
}

export interface ActivityExercise {
    id?: number;
    exercise: Exercise;
    activity: Activity;
    order: number;
}

export interface Workout {
    id?: number;
    name: string;
    sets?: number | null;
    type?: WorkoutType | null;
    workoutActivities?: WorkoutActivity[];
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

export interface Availability {
    id?: number
    userId: number
    timezone: string
    dayOfWeek: number
    startTime: Date
    endTime: Date
    startDate: Date
    repeatUntil?: Date | null
}

export interface Reservation {
    id?: number
    timezone: string
    userId: number
    availabilityId: number
    startTime: Date
    duration: number
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
    availabilities: Availability[]
    reservations: Reservation[]
}

export interface Session {
    id?: number;
    notes?: string | null;
    reservation?: Reservation;
    participants?: User[];
    trainer?: User;
    workoutRecord?: WorkoutRecord;
}

export interface CreateSessionData {
    notes?: string | null;
    reservation?: { id: number };
    participants?: { id: number }[];
    trainer?: { id: number };
    workoutRecord?: {
        notes?: string | null;
        workout?: { id: number };
        activityRecords?: Array<{
            notes?: string | null;
            phase: "warmup" | "work" | "cooldown";
            activity?: { id: number }; // Corresponds to ActivityExercise.entity.ts
            exerciseRecords?: Array<{
                notes?: string | null;
                exercise?: { id: number };
                load?: number | null;
                time?: number | null;
                sets?: number | null; // Added sets to match ExerciseRecord entity
            }>;
        }>;
    };
}

export interface WorkoutRecord {
    id?: number;
    notes?: string | null;
    workout?: Workout;
    activityRecords?: ActivityRecord[];
}

export interface ActivityRecord {
    id?: number;
    notes?: string | null;
    activity?: Activity;
    exerciseRecords?: ExerciseRecord[];
}

export interface ExerciseRecord {
    id?: number;
    notes?: string | null;
    exercise?: Exercise;
    load?: number | null;
    duration?: number | null;
    reps?: number | null;
}

export type Page = 'reservation' | 
'availability' |
'trainers' |
'signup' |
'clients' |
'profile' |
'assignments'|
'default' |
'login' |
'workout'|
'exercise' |
'activity' |
'sessions'

