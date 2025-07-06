import React, { FC, useEffect, useMemo, useState } from "react";
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    SelectChangeEvent,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { Availability, Page, Reservation, User } from "../types";
import availabilityServiceClient from "../services/availabilityServiceClient";
import { useUserGroups } from "../hooks/users";
import dates from "../helpers/dates";
import reservationServiceClient from "../services/reservationServiceClient";
import ReservationTable from "../components/ReservationTable";

interface ReservationPageProps {
    user: User;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const getExpandedAvailability = (block: Availability, duration: number) => {
    const numSegments = Math.round((block.endTime.getTime() - block.startTime.getTime()) / (60000 * duration));
    return Array.from({ length: numSegments }, (_, i) => ({
        ...block,
        startTime: new Date(block.startTime.getTime() + i * duration * 60000),
        endTime: new Date(block.startTime.getTime() + (i + 1) * duration * 60000),
    }));
}

const ReservationPage: FC<ReservationPageProps> = ({user, setPage}) => {
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [duration, setDuration] = useState<number>(60)

    const userGroups = useUserGroups()
    const [selectedTrainers, setSelectedTrainers] = useState<number[]>([]);
    const [filters, setFilters] = useState<Record<keyof Pick<Availability, 'startDate' | 'dayOfWeek' | 'startTime' | 'endTime'>, string>>({
        startDate: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
    });
    const [filteredAvailability, setFilteredAvailability] = useState<Availability[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<Availability | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            const availabilityData = await availabilityServiceClient.getAllAvailability(true);
            setAvailability(availabilityData);
        };
        fetchAvailability();
    }, []);

    const expandedAvailability = useMemo(() => {
        return availability.flatMap((block) => getExpandedAvailability(block, duration));
    }, [availability, duration]);

    useEffect(() => {
        const fetchReservations = async () => {
            const reservationData = await reservationServiceClient.getReservations();
            setReservations(reservationData);
        };
        fetchReservations();
    }, [])

    useEffect(() => {
        const filtered = expandedAvailability.flat().filter((block) => {
            const matchesReservation = reservations.some((reservation) => (
                reservation.availabilityId === block.id && (
                    // Check if the reservation is within the block entirely
                    (block.startTime <= reservation.startTime && block.endTime.getTime() >= (reservation.startTime.getTime() + reservation.duration * 60000)) ||
                    // check if the reservation starts before the block and ends somewhere in the block
                    (reservation.startTime < block.startTime && (reservation.startTime.getTime() + reservation.duration * 60000) >= block.endTime.getTime()) ||
                    // check if the reservation starts in the block and ends after the block
                    (reservation.startTime >= block.startTime && reservation.startTime.getTime() <= block.endTime.getTime() && (reservation.startTime.getTime() + reservation.duration * 60000) >= block.endTime.getTime())
                    
                )
            ));
            if (matchesReservation) {
                return false;
            }
            const matchesTrainer = selectedTrainers.length === 0 || selectedTrainers.includes(block.userId);
            const matchesDayOfWeek =
                filters.dayOfWeek === "" || block.dayOfWeek === parseInt(filters.dayOfWeek, 10);
            const matchesStartDate = filters.startDate === "" || block.startDate >= new Date(Date.parse(filters.startDate));
            const matchesStartTime = filters.startTime === "" || block.startTime >= new Date(Date.parse(filters.startTime)) && block.startTime >= new Date(Date.parse(filters.startDate));
            const matchesEndTime = filters.endTime === "" || block.endTime.toISOString() <= filters.endTime;
            return matchesTrainer && matchesDayOfWeek && matchesStartDate && matchesStartTime && matchesEndTime;
        });
        setFilteredAvailability(filtered);
    }, [expandedAvailability, selectedTrainers, filters, reservations, duration]);

    const handleTrainerSelection = (trainerId: number) => {
        setSelectedTrainers((prev) =>
            prev.includes(trainerId) ? prev.filter((id) => id !== trainerId) : [...prev, trainerId]
        );
    };

    const handleFilterChange = (e: SelectChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReserveClick = async (block: Availability) => {
        setSelectedBlock(block);
        setOpenDialog(true);
        await reservationServiceClient.createReservation({
            userId: block.userId,
            availabilityId: block.id!,
            startTime: block.startTime,
            duration: Math.round((block.endTime.getTime() - block.startTime.getTime()) / 60000),
            timezone: block.timezone,
        })
        

    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedBlock(null);
    };

    const handleDialogConfirm = async () => {
        if (selectedBlock) {
            await reservationServiceClient.createReservation({
                userId: selectedBlock.userId,
                availabilityId: selectedBlock.id!,
                startTime: selectedBlock.startTime,
                duration: Math.round((selectedBlock.endTime.getTime() - selectedBlock.startTime.getTime()) / 60000),
                timezone: selectedBlock.timezone,
            })
            setSelectedBlock(null);
        };

        setOpenDialog(false);
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Trainer Availability
            </Typography>
            <ReservationTable user={user} reservations={reservations} />
            {/* Filters */}
            <Stack spacing={2} sx={{ marginBottom: 3 }}>
                <FormControl fullWidth>
                    <InputLabel id="day-of-week-label">Day of Week</InputLabel>
                    <Select
                        labelId="day-of-week-label"
                        name="dayOfWeek"
                        value={filters.dayOfWeek}
                        onChange={handleFilterChange}
                    >
                        <MenuItem value="0">Sunday</MenuItem>
                        <MenuItem value="1">Monday</MenuItem>
                        <MenuItem value="2">Tuesday</MenuItem>
                        <MenuItem value="3">Wednesday</MenuItem>
                        <MenuItem value="4">Thursday</MenuItem>
                        <MenuItem value="5">Friday</MenuItem>
                        <MenuItem value="6">Saturday</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <TextField
                    label="Start Time"
                    name="startTime"
                    type="time"
                    value={filters.startTime}
                    onChange={handleFilterChange}
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <TextField
                    label="End Time"
                    name="endTime"
                    type="time"
                    value={filters.endTime}
                    onChange={handleFilterChange}
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <Typography variant="h6">Select Trainers</Typography>
                <List>
                    {userGroups['TRAINER'].map((trainer) => (
                        <ListItem key={`trainer-${trainer.id}`} disablePadding>
                            <Checkbox
                                checked={selectedTrainers.includes(trainer.id!)}
                                onChange={() => handleTrainerSelection(trainer.id!)}
                            />
                            <ListItemText primary={`${trainer.firstName} ${trainer.lastName}`} />
                        </ListItem>
                    ))}
                </List>
            </Stack>

            {/* Duration radio button group selection */}
            <Stack spacing={2} sx={{ marginBottom: 3 }}>
                <Typography variant="h6">Select Duration</Typography>
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        value={duration.toString()}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        name="duration-radio-group"
                    >
                        <FormControlLabel value="30" control={<Radio />} label="30 min" />
                        <FormControlLabel value="60" control={<Radio />} label="60 min" />
                        <FormControlLabel value="90" control={<Radio />} label="90 min" />
                        <FormControlLabel value="120" control={<Radio />} label="120 min" />
                    </RadioGroup>
                </FormControl>
            </Stack>
            {/* Filtered Availability */}
            <List>
                {filteredAvailability.map((block) => (
                    <ListItem key={`block-${block.id}-${block.startTime.toISOString()}`}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Trainer:</strong> {userGroups['TRAINER'].find(t => t.id === block.userId)?.firstName} {userGroups['TRAINER'].find(t => t.id === block.userId)?.lastName}
                                    <br />
                                    <strong>Day of Week:</strong> {dates.getDayOfWeek(block.dayOfWeek)}
                                    <br />
                                    <strong>Date:</strong> {block.startDate.toLocaleDateString([], { timeZone: block.timezone })}
                                    <br />
                                    <strong>Time:</strong>{" "}
                                    {block.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} -{" "}
                                    {block.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </>
                            }
                            secondary={
                                <>
                                    <strong>Timezone:</strong> {block.timezone}
                                </>
                            }
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleReserveClick(block)}
                        >
                            Reserve
                        </Button>
                    </ListItem>
                ))}
            </List>

            {/* Reservation Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Reserve Time Block</DialogTitle>
                <DialogContent>
                    <Typography>
                        {selectedBlock
            ? <>
                Reserving block on <strong>
                    {selectedBlock.startDate.toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: selectedBlock.timezone
                    })}
                </strong>
                {" from "}
                <strong>
                    {selectedBlock.startTime.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: selectedBlock.timezone
                    })}
                </strong>
                {" to "}
                <strong>
                    {selectedBlock.endTime.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: selectedBlock.timezone
                    })}
                </strong>
                {" ("}{selectedBlock.timezone}{")"}
            </>
            : ""}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDialogConfirm} color="primary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ReservationPage;