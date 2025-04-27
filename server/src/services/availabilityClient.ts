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

export default {
    getAvailabilities,
    updateAvailability,
    createAvailability
}