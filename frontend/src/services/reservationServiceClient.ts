import { Reservation } from "../types";

const API_URL = `http://localhost:3000/reservation`;

const createReservation = async (reservation: Reservation) => {
    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
    });
    if (!response.ok) {
        throw new Error("Failed to create reservation");
    }
    const data = await response.json();
    return data.reservation;
}

const getReservations = async () => {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
        throw new Error("Failed to fetch reservations");
    }
    const data = await response.json();
    return data.reservations.map((reservation: Reservation) => ({
        ...reservation,
        date: new Date(reservation.date)
    }))
}

const updateReservation = async (reservation: Reservation) => {
    const response = await fetch(`${API_URL}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
    });
    if (!response.ok) {
        throw new Error("Failed to update reservation");
    }
    const data = await response.json();
    return data.reservation;
}

const deleteReservation = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete reservation");
    }
}

export default {
    createReservation,
    getReservations,
    updateReservation,
    deleteReservation,
}