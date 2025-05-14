import { AppDataSource } from "../data-source"
import { Reservation } from "../entity/Reservation.entity"

const getReservations = async (): Promise<Reservation[]> => {
    return  await AppDataSource.getRepository(Reservation).find()
}

const updateReservation = async (reservation: Reservation): Promise<Reservation> => {
    return await AppDataSource.getRepository(Reservation).save(reservation)
}

const createReservation = async (reservation: Reservation): Promise<Reservation> => {
    const newReservation = AppDataSource.getRepository(Reservation).create(reservation)
    return await AppDataSource.getRepository(Reservation).save(newReservation)
}

const deleteReservation = async (id: number): Promise<void> => {
    await AppDataSource.getRepository(Reservation).delete(id)
}


export default {
    getReservations,
    updateReservation,
    createReservation,
    deleteReservation
}