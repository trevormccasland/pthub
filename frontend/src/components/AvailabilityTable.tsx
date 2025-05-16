import { FC, useEffect, useState } from "react";
import { Availability, User } from "../types";
import availabilityServiceClient from "../services/availabilityServiceClient";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import dates from "../helpers/dates";

interface AvailabilityTableProps {
    user: User
}

const AvailabilityTable: FC<AvailabilityTableProps> = ({user}) => {
    const [myAvailabilities, setMyAvailabilities] = useState<Availability[]>([]);

    useEffect(() => {
        const fetchMyAvailabilities = async () => {
            const data = await availabilityServiceClient.getAvailabilitiesById(user.id!);
            setMyAvailabilities(data);
        };
        if (user.id) fetchMyAvailabilities();
    }, [user.id]);

    return <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Day</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Timezone</TableCell>
                    <TableCell>Repeats Until</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {myAvailabilities.map((a) => (
                    <TableRow key={a.id}>
                        <TableCell>
                            {a.startDate ? new Date(a.startDate).toLocaleDateString() : ""}
                        </TableCell>
                        <TableCell>
                            {dates.getDayOfWeek(a.dayOfWeek)}
                        </TableCell>
                        <TableCell>
                            {a.startTime ? new Date(a.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </TableCell>
                        <TableCell>
                            {a.endTime ? new Date(a.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </TableCell>
                        <TableCell>{a.timezone}</TableCell>
                        <TableCell>
                            {a.repeatUntil ? new Date(a.repeatUntil).toLocaleDateString() : ""}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}
export default AvailabilityTable;