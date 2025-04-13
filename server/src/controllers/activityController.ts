import { Request, Response } from "express";
import { Activity } from "../entity/Activity.entity";
import activityClient from "../services/activityClient";
import { AppDataSource } from "../data-source";

interface ActivitiesResponse {
    activities: Activity[]
}

interface ActivityResponse {
    activity: Activity
}

const getActivitiesResponse = async (req: Request, res: Response<ActivitiesResponse>) => {
    const activities = await activityClient.getActivities()
    res.json({ activities });
}

const updateAcitivtyResponse = async (req: Request, res: Response<ActivityResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(Activity, body)
    const activity = await activityClient.updateActivity(entity)
    res.json({activity})
}

const createActivityResponse = async (req: Request, res: Response<ActivityResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(Activity, body)
    const activity = await activityClient.createActivity(entity)
    res.json({activity})
}

export default {
    getActivitiesResponse,
    updateAcitivtyResponse,
    createActivityResponse
}