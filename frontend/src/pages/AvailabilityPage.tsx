import React, { FC, useState } from "react";
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Stack,
    MenuItem,
    Autocomplete,
} from "@mui/material";
import availabilityServiceClient from "../services/availabilityServiceClient"; // Mocked service client for handling availability
import { Availability, Page, User } from "../types";
import { timezones } from "../helpers/dates";
import AvailabilityTable from "../components/AvailabilityTable";

interface AvailabilityPageProps {
    user: User;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const AvailabilityPage: FC<AvailabilityPageProps> = ({user, setPage}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [availability, setAvailability] = useState<Record<keyof Pick<Availability, 'dayOfWeek' | 'startTime' | 'endTime' | 'timezone' | 'repeatUntil' | 'startDate'>, string>>({
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        timezone: "",
        startDate: "",
        repeatUntil: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAvailability((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setAvailability({
            dayOfWeek: "",
            startTime: "",
            endTime: "",
            timezone: "",
            startDate: "",
            repeatUntil: "",
        });
    };

    const handleCreateAvailability = async () => {
        const startTime = new Date(availability.startDate + "T" + availability.startTime);
        const endTime = new Date(availability.startDate + "T" + availability.endTime);
        console.log("Creating availability:", availability, startTime, endTime, user.id);

        await availabilityServiceClient.createAvailability({
            userId: user.id!,
            dayOfWeek: parseInt(availability.dayOfWeek, 10),
            startTime,
            endTime,
            timezone: availability.timezone,
            startDate: new Date(availability.startDate + "T" + availability.startTime),
            repeatUntil: availability.repeatUntil ? new Date(availability.repeatUntil + "T" + availability.startTime) : null,
        });

        // Close the dialog and reset the form
        handleCloseDialog();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Create Availability
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Add Availability
            </Button>
            <AvailabilityTable user={user} />
            {/* Dialog for Creating Availability */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Create Availability</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={availability.startDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            select
                            label="Day of Week"
                            name="dayOfWeek"
                            value={availability.dayOfWeek}
                            onChange={handleChange}
                            fullWidth
                        >
                            {[
                                { value: "0", label: "Sunday" },
                                { value: "1", label: "Monday" },
                                { value: "2", label: "Tuesday" },
                                { value: "3", label: "Wednesday" },
                                { value: "4", label: "Thursday" },
                                { value: "5", label: "Friday" },
                                { value: "6", label: "Saturday" },
                            ].map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Start Time"
                            name="startTime"
                            type="time"
                            value={availability.startTime}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="End Time"
                            name="endTime"
                            type="time"
                            value={availability.endTime}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {/* Timezone Autocomplete */}
                        <Autocomplete
                            options={timezones}
                            getOptionLabel={(option: string) => option}
                            value={availability.timezone || ""}
                            onChange={(_, newValue) =>
                                setAvailability((prev) => ({
                                    ...prev,
                                    timezone: newValue || "",
                                }))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Timezone"
                                    name="timezone"
                                    fullWidth
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option === value}
                        />
                        <TextField
                            label="Repeat Until (Optional)"
                            name="repeatUntil"
                            type="date"
                            value={availability.repeatUntil}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateAvailability} color="primary" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AvailabilityPage;