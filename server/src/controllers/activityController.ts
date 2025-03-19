import { Request, Response } from "express";
import { Activity } from "../entity/Activity.entity";
import activityClient from "../services/activityClient";

interface ActivityResponse {
    activities: Activity[]
}

const getActivitiesResponse = async (req: Request, res: Response<ActivityResponse>) => {
    const activities = await activityClient.getActivities()
    res.json({ activities });
}

export default {
    getActivitiesResponse
}