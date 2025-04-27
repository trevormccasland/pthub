import { Request, Response } from "express";
import { Availability } from "../entity/Availability.entity";
import availabilityClient from "../services/availabilityClient";
import { AppDataSource } from "../data-source";

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

const createAvailabilityResponse = async (req: Request, res: Response<AvailabilityResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(Availability, body)
    const availability = await availabilityClient.createAvailability(entity)
    res.json({availability})
}

export default {
    getAvailabilitiesResponse,
    updateAvailabilityResponse,
    createAvailabilityResponse
}