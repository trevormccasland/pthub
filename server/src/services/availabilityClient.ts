import { AppDataSource } from "../data-source"
import { Availability } from "../entity/Availability.entity"

const getAvailabilities = async (): Promise<Availability[]> => {
    return  await AppDataSource.getRepository(Availability).find()
}

const updateAvailability = async (availability: Availability): Promise<Availability> => {
    return await AppDataSource.getRepository(Availability).save(availability)
}

const createAvailability = async (availability: Availability): Promise<Availability> => {
    const newAvailability = AppDataSource.getRepository(Availability).create(availability)
    return await AppDataSource.getRepository(Availability).save(newAvailability)
}

const deleteAvailability = async (id: number): Promise<void> => {
    await AppDataSource.getRepository(Availability).delete(id)
}


export default {
    getAvailabilities,
    updateAvailability,
    createAvailability,
    deleteAvailability
}