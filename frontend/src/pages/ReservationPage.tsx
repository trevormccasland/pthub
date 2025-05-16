import React, { FC, useEffect, useState } from "react";
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
} from "@mui/material";
import { Availability, Page, Reservation, User } from "../types";
import availabilityServiceClient from "../services/availabilityServiceClient";
import { useUserGroups } from "../hooks/users";
import dates from "../helpers/dates";
import reservationServiceClient from "../services/reservationServiceClient";

interface ReservationPageProps {
    user: User;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const ReservationPage: FC<ReservationPageProps> = () => {
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const userGroups = useUserGroups()
    const [selectedTrainers, setSelectedTrainers] = useState<number[]>([]);
    const [filters, setFilters] = useState({
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

    useEffect(() => {
        const fetchReservations = async () => {
            const reservationData = await reservationServiceClient.getReservations();
            console.log("Fetched Reservations:", reservationData);
            setReservations(reservationData);
        };
        fetchReservations();
    }, [])

    useEffect(() => {
        const filtered = availability.filter((block) => {
            const matchesReservation = reservations.some((reservation) => reservation.availabilityId === block.id && reservation.date.toISOString() === block.startDate.toISOString());
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
    }, [availability, selectedTrainers, filters, reservations]);

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
        console.log("Reserving block:", block);
        await reservationServiceClient.createReservation({
            userId: block.userId,
            availabilityId: block.id!,
            date: block.startDate
        })
        setAvailability((prev) =>
            prev.filter((availability) => availability.id !== block.id)
        )

    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedBlock(null);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Trainer Availability
            </Typography>

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

            {/* Filtered Availability */}
            <List>
                {filteredAvailability.map((block) => (
                    <ListItem key={`block-${block.id}-${block.startTime.toISOString()}`}>
                        <ListItemText
                            primary={
                                <>
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
                    <Button color="primary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ReservationPage;