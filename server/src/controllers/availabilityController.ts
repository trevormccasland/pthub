import { Request, Response } from "express";
import { Availability } from "../entity/Availability.entity";
import availabilityClient from "../services/availabilityClient";
import { AppDataSource } from "../data-source";
import userClient from "../services/userClient";
import { fromZonedTime } from "date-fns-tz";

interface AvailabilityListResponse {
    availabilities: Availability[]
}

interface AvailabilityResponse {
    availability: Availability
}

const getAvailabilitiesResponse = async (req: Request, res: Response<AvailabilityListResponse>) => {
    const availabilities = await availabilityClient.getAvailabilities()
    res.json({ availabilities });
}

const updateAvailabilityResponse = async (req: Request, res: Response<AvailabilityResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(Availability, body)
    const availability = await availabilityClient.updateAvailability(entity)
    res.json({availability})
}

const createAvailabilityResponse = async (req: Request, res: Response<AvailabilityResponse | { message: string }>) => {
    const body = req.body
    const userId = parseInt(req.body.userId, 10)
    const user = await userClient.getUser(userId)
    if (!user) {
        res.status(404).json({ message: "User not found" })
        return
    }
    const entity = AppDataSource.manager.create(Availability, {
        ...body,
        userId,
        user,
        startTime: fromZonedTime(body.startTime, body.timezone),
        endTime: fromZonedTime(body.endTime, body.timezone),
        startDate: fromZonedTime(body.startDate, body.timezone),
        repeatUntil: body.repeatUntil ? fromZonedTime(body.repeatUntil, body.timezone) : null
    })
    const availability = await availabilityClient.createAvailability(entity)
    res.json({availability})
}

const deleteAvailabilityResponse = async (req: Request, res: Response) => {
    const { id } = req.body
    await availabilityClient.deleteAvailability(id)
    res.status(204).send()
}

export default {
    getAvailabilitiesResponse,
    updateAvailabilityResponse,
    createAvailabilityResponse,
    deleteAvailabilityResponse
}