import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Reservation } from "../entity/Reservation.entity"
import reservationClient from "../services/reservationClient"
import userClient from "../services/userClient"

interface ReservationListResponse {
    reservations: Reservation[]
}

interface ReservationResponse {
    reservation: Reservation
}

const createReservationResponse = async (req: Request, res: Response<ReservationResponse | { message: string }>) => {
    const body = req.body
    const userId = parseInt(req.body.userId, 10)
    const user = await userClient.getUser(userId)
    if (!user) {
        res.status(404).json({ message: "User not found" })
        return
    }
    const entity = AppDataSource.manager.create(Reservation, body)
    const reservation = await reservationClient.createReservation(entity)
    res.json({ reservation })
}

const getReservationsResponse = async (req: Request, res: Response<ReservationListResponse>) => {
    const reservations = await reservationClient.getReservations()
    res.json({ reservations });
}

const updateReservationResponse = async (req: Request, res: Response<ReservationResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(Reservation, body)
    const reservation = await reservationClient.updateReservation(entity)
    res.json({reservation})
}

const deleteReservationResponse = async (req: Request, res: Response) => {
    const { id } = req.body
    await reservationClient.deleteReservation(id)
    res.status(204).send()
}

export default {
    createReservationResponse,
    getReservationsResponse,
    updateReservationResponse,
    deleteReservationResponse
}