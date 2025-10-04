import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    OutlinedInput,
    Chip,
    Stack,
    Divider,
    Paper,
} from "@mui/material";

import { User, Reservation, Workout, Activity, CreateSessionData } from "../types";
import reservationClient from "../services/reservationServiceClient";
import workoutClient from "../services/workoutServiceClient";
import userClient from "../services/userServiceClient";
import sessionClient from "../services/sessionServiceClient";

interface ExerciseRecordForm {
    id?: number;
    name?: string;
    notes?: string;
    exerciseId?: number;
    load?: number;
    time?: number;
    reps?: number;
    sets?: number;
}

interface ActivityRecordForm {
    id?: number;
    name?: string;
    notes?: string;
    activityId?: number;
    exerciseRecords: ExerciseRecordForm[];
}

interface WorkoutRecordForm {
    id?: number;
    name?: string;
    notes?: string;
    workoutId?: number;
    warmupRecords: ActivityRecordForm[];
    workRecords: ActivityRecordForm[];
    cooldownRecords: ActivityRecordForm[];
}

interface SessionFormProps {
    user: User;
}

const SessionPage: React.FC<SessionFormProps> = ({
    user
}) => {
    const [notes, setNotes] = useState("");
    const [reservationId, setReservationId] = useState("");
    const [participantIds, setParticipantIds] = useState<number[]>([]);
    const [workoutRecord, setWorkoutRecord] = useState<WorkoutRecordForm>({
        notes: "",
        name: "",
        workoutId: undefined,
        warmupRecords: [],
        workRecords: [],
        cooldownRecords: [],
    });
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const [resv, work, usr] = await Promise.all([
                reservationClient.getReservations(),
                workoutClient.getWorkouts(),
                userClient.getUsers()
            ]);
            setReservations(resv);
            setWorkouts(work);
            setUsers(usr);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (!workoutRecord.workoutId) return;

        const selectedWorkout = workouts.find(w => w.id === workoutRecord.workoutId);
        if (!selectedWorkout) return;

        // Map activities and exercises for each section
        const mapActivityRecords = (activities: Activity[]) =>
            activities.map(act => ({
                notes: "",
                activityId: act.id,
                name: act.name,
                exerciseRecords: (act.group || []).map(ex => ({
                    notes: "",
                    name: ex.name,
                    exerciseId: ex.id,
                    load: undefined,
                    reps: ex.reps || undefined,
                    sets: ex.sets || undefined,
                    time: ex.time || undefined,
                })),
            }));

        setWorkoutRecord({
            ...workoutRecord,
            warmupRecords: mapActivityRecords(selectedWorkout.warmup),
            workRecords: mapActivityRecords(selectedWorkout.work),
            cooldownRecords: mapActivityRecords(selectedWorkout.cooldown),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workoutRecord.workoutId, workouts]);

    const onSubmit = async (data: CreateSessionData) => {
        try {
            const created = await sessionClient.createSession(data);
            console.log("Session created:", created);
            // Reset form or show success message as needed
        } catch (error) {
            console.error("Error creating session:", error);
        }
    }
    // Handlers for nested entities
    const handleWorkoutRecordChange = (field: keyof WorkoutRecordForm, value: any) => {
        setWorkoutRecord({ ...workoutRecord, [field]: value });
    };

    const handleActivityRecordChange = (
        section: "warmupRecords" | "workRecords" | "cooldownRecords",
        idx: number,
        field: keyof ActivityRecordForm,
        value: any
    ) => {
        const updated = [...(workoutRecord[section] || [])];
        updated[idx] = { ...updated[idx], [field]: value };
        setWorkoutRecord({ ...workoutRecord, [section]: updated });
    };

    const handleExerciseRecordChange = (
        section: "warmupRecords" | "workRecords" | "cooldownRecords",
        activityIdx: number,
        exerciseIdx: number,
        field: keyof ExerciseRecordForm,
        value: any
    ) => {
        const updatedActivities = [...(workoutRecord[section] || [])];
        const updatedExercises = [...updatedActivities[activityIdx].exerciseRecords];
        updatedExercises[exerciseIdx] = { ...updatedExercises[exerciseIdx], [field]: value };
        updatedActivities[activityIdx].exerciseRecords = updatedExercises;
        setWorkoutRecord({ ...workoutRecord, [section]: updatedActivities });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            notes,
            reservation: reservationId ? { id: Number(reservationId) } : undefined,
            participants: participantIds.map(id => ({ id })),
            trainer: user ? { id: user.id! } : undefined,
            workoutRecord: {
                notes: workoutRecord.notes,
                workout: workoutRecord.workoutId ? { id: workoutRecord.workoutId } : undefined,
                warmupRecords: workoutRecord.warmupRecords?.map(ar => ({
                    notes: ar.notes,
                    activity: ar.activityId ? { id: ar.activityId } : undefined,
                    exerciseRecords: ar.exerciseRecords?.map(er => ({
                        notes: er.notes,
                        exercise: er.exerciseId ? { id: er.exerciseId } : undefined,
                        load: er.load,
                        time: er.time,
                        reps: er.reps,
                        sets: er.sets,
                    })),
                })),
                workRecords: workoutRecord.workRecords?.map(ar => ({
                    notes: ar.notes,
                    activity: ar.activityId ? { id: ar.activityId } : undefined,
                    exerciseRecords: ar.exerciseRecords?.map(er => ({
                        notes: er.notes,
                        exercise: er.exerciseId ? { id: er.exerciseId } : undefined,
                        load: er.load,
                        time: er.time,
                        reps: er.reps,
                        sets: er.sets,
                    })),
                })),
                cooldownRecords: workoutRecord.cooldownRecords?.map(ar => ({
                    notes: ar.notes,
                    activity: ar.activityId ? { id: ar.activityId } : undefined,
                    exerciseRecords: ar.exerciseRecords?.map(er => ({
                        notes: er.notes,
                        exercise: er.exerciseId ? { id: er.exerciseId } : undefined,
                        load: er.load,
                        time: er.time,
                        reps: er.reps,
                        sets: er.sets,
                    })),
                })),
            }
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
            <Typography variant="h5" gutterBottom>Session</Typography>
            <Stack spacing={2}>
                <TextField
                    label="Notes"
                    multiline
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel id="reservation-label">Reservation</InputLabel>
                    <Select
                        labelId="reservation-label"
                        value={reservationId}
                        label="Reservation"
                        onChange={e => setReservationId(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Select reservation</em>
                        </MenuItem>
                        {reservations.map(r => (
                            <MenuItem key={r.id} value={r.id}>{r.userId}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="participants-label">Participants</InputLabel>
                    <Select
                        labelId="participants-label"
                        multiple
                        value={participantIds}
                        onChange={e => setParticipantIds(typeof e.target.value === "string" ? [] : e.target.value as number[])}
                        input={<OutlinedInput label="Participants" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(selected as number[]).map(id => {
                                    const user = users.find(u => u.id === id);
                                    return <Chip key={id} label={user ? `${user.firstName} ${user.lastName}` : id} />;
                                })}
                            </Box>
                        )}
                    >
                        {users.map(u => (
                            <MenuItem key={u.id} value={u.id}>{`${u.firstName} ${u.lastName}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Divider />
                <Typography variant="h6">Workout Record</Typography>
                <FormControl fullWidth>
                    <InputLabel id="workout-label">Workout</InputLabel>
                    <Select
                        labelId="workout-label"
                        value={workoutRecord.workoutId || ""}
                        label="Workout"
                        onChange={e => handleWorkoutRecordChange("workoutId", Number(e.target.value))}
                    >
                        <MenuItem value="">
                            <em>Select workout</em>
                        </MenuItem>
                        {workouts.map(w => (
                            <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Workout Notes"
                    multiline
                    value={workoutRecord.notes || ""}
                    onChange={e => handleWorkoutRecordChange("notes", e.target.value)}
                    fullWidth
                />
                <Typography variant="subtitle1">Warmup Records</Typography>
                <Stack spacing={2}>
                    {workoutRecord.warmupRecords.map((ar, idx) => (
                        <Paper key={idx} sx={{ p: 2 }}>
                            <Typography variant="subtitle2">
                                {`Activity: ${ar.name}`}
                            </Typography>
                            <TextField
                                label="Activity Notes"
                                multiline
                                value={ar.notes || ""}
                                onChange={e => handleActivityRecordChange("warmupRecords", idx, "notes", e.target.value)}
                                fullWidth
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="subtitle2">Exercise Records</Typography>
                            <Stack spacing={1}>
                                {ar.exerciseRecords.map((er, eidx) => (
                                    <Paper key={eidx} sx={{ p: 1, background: "#f9f9f9" }}>
                                        <Typography variant="body2">{`Exercise: ${er.name}`}</Typography>
                                        <TextField
                                            label="Load"
                                            type="number"
                                            value={er.load || ""}
                                            onChange={e => handleExerciseRecordChange("warmupRecords", idx, eidx, "load", Number(e.target.value))}
                                            sx={{ mr: 1, width: 120 }}
                                        />
                                        <TextField
                                            label="time (sec)"
                                            type="number"
                                            value={er.time || ""}
                                            onChange={e => handleExerciseRecordChange("warmupRecords", idx, eidx, "time", Number(e.target.value))}
                                            sx={{ mr: 1, width: 150 }}
                                        />
                                        <TextField
                                            label="Reps"
                                            type="number"
                                            value={er.reps || ""}
                                            onChange={e => handleExerciseRecordChange("warmupRecords", idx, eidx, "reps", Number(e.target.value))}
                                            sx={{ mr: 1, width: 100 }}
                                        />
                                        <TextField
                                            label="Sets"
                                            type="number"
                                            value={er.sets || ""}
                                            onChange={e => handleExerciseRecordChange("warmupRecords", idx, eidx, "sets", Number(e.target.value))}
                                            sx={{ mr: 1, width: 100 }}
                                        />
                                        <TextField
                                            label="Notes"
                                            value={er.notes || ""}
                                            onChange={e => handleExerciseRecordChange("warmupRecords", idx, eidx, "notes", e.target.value)}
                                            sx={{ width: 200 }}
                                        />
                                    </Paper>
                                ))}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>Work Records</Typography>
                <Stack spacing={2}>
                    {workoutRecord.workRecords.map((ar, idx) => (
                        <Paper key={idx} sx={{ p: 2 }}>
                            <Typography variant="subtitle2">
                                {`Activity: ${ar.name}`}
                            </Typography>
                            <TextField
                                label="Activity Notes"
                                multiline
                                value={ar.notes || ""}
                                onChange={e => handleActivityRecordChange("workRecords", idx, "notes", e.target.value)}
                                fullWidth
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="subtitle2">Exercise Records</Typography>
                            <Stack spacing={1}>
                                {ar.exerciseRecords.map((er, eidx) => (
                                    <Paper key={eidx} sx={{ p: 1, background: "#f9f9f9" }}>
                                        <Typography variant="body2">{`Exercise: ${er.name}`}</Typography>
                                        <TextField
                                            label="Load"
                                            type="number"
                                            value={er.load || ""}
                                            onChange={e => handleExerciseRecordChange("workRecords", idx, eidx, "load", Number(e.target.value))}
                                            sx={{ mr: 1, width: 120 }}
                                        />
                                        <TextField
                                            label="time (sec)"
                                            type="number"
                                            value={er.time || ""}
                                            onChange={e => handleExerciseRecordChange("workRecords", idx, eidx, "time", Number(e.target.value))}
                                            sx={{ mr: 1, width: 150 }}
                                        />
                                        <TextField
                                            label="Reps"
                                            type="number"
                                            value={er.reps || ""}
                                            onChange={e => handleExerciseRecordChange("workRecords", idx, eidx, "reps", Number(e.target.value))}
                                            sx={{ mr: 1, width: 100 }}
                                        />
                                        <TextField
                                            label="Sets"
                                            type="number"
                                            value={er.sets || ""}
                                            onChange={e => handleExerciseRecordChange("warmupRecords", idx, eidx, "sets", Number(e.target.value))}
                                            sx={{ mr: 1, width: 100 }}
                                        />
                                        <TextField
                                            label="Notes"
                                            value={er.notes || ""}
                                            onChange={e => handleExerciseRecordChange("workRecords", idx, eidx, "notes", e.target.value)}
                                            sx={{ width: 200 }}
                                        />
                                    </Paper>
                                ))}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>Cooldown Records</Typography>
                <Stack spacing={2}>
                    {workoutRecord.cooldownRecords.map((ar, idx) => (
                        <Paper key={idx} sx={{ p: 2 }}>
                            <Typography variant="subtitle2">
                                {`Activity: ${ar.name}`}
                            </Typography>
                            <TextField
                                label="Activity Notes"
                                multiline
                                value={ar.notes || ""}
                                onChange={e => handleActivityRecordChange("cooldownRecords", idx, "notes", e.target.value)}
                                fullWidth
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="subtitle2">Exercise Records</Typography>
                            <Stack spacing={1}>
                                {ar.exerciseRecords.map((er, eidx) => (
                                    <Paper key={eidx} sx={{ p: 1, background: "#f9f9f9" }}>
                                        <Typography variant="body2">{`Exercise: ${er.name}`}</Typography>
                                        <TextField
                                            label="Load"
                                            type="number"
                                            value={er.load || ""}
                                            onChange={e => handleExerciseRecordChange("cooldownRecords", idx, eidx, "load", Number(e.target.value))}
                                            sx={{ mr: 1, width: 120 }}
                                        />
                                        <TextField
                                            label="time (sec)"
                                            type="number"
                                            value={er.time || ""}
                                            onChange={e => handleExerciseRecordChange("cooldownRecords", idx, eidx, "time", Number(e.target.value))}
                                            sx={{ mr: 1, width: 150 }}
                                        />
                                        <TextField
                                            label="Reps"
                                            type="number"
                                            value={er.reps || ""}
                                            onChange={e => handleExerciseRecordChange("cooldownRecords", idx, eidx, "reps", Number(e.target.value))}
                                            sx={{ mr: 1, width: 100 }}
                                        />
                                        <TextField
                                            label="Sets"
                                            type="number"
                                            value={er.sets || ""}
                                            onChange={e => handleExerciseRecordChange("warmupRecords", idx, eidx, "sets", Number(e.target.value))}
                                            sx={{ mr: 1, width: 100 }}
                                        />
                                        <TextField
                                            label="Notes"
                                            value={er.notes || ""}
                                            onChange={e => handleExerciseRecordChange("cooldownRecords", idx, eidx, "notes", e.target.value)}
                                            sx={{ width: 200 }}
                                        />
                                    </Paper>
                                ))}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Button type="submit" variant="contained" color="primary">
                    Save Session
                </Button>
            </Stack>
        </Box>
    );
};

export default SessionPage;