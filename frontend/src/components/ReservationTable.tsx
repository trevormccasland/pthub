import { FC } from "react";
import { Reservation, User } from "../types";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface ReservationTableProps {
    user: User;
    reservations: Reservation[];
}

const ReservationTable: FC<ReservationTableProps> = ({ user, reservations }) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Start Time</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Availability ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reservations.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} align="center">
                                No reservations found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        reservations.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>
                                    {r.startTime ? new Date(r.startTime).toLocaleString() : ""}
                                </TableCell>
                                <TableCell>{r.duration}</TableCell>
                                <TableCell>{r.availabilityId}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReservationTable;