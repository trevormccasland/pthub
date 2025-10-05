import { AppDataSource } from "../data-source"
import { Activity } from "../entity/Activity.entity"

const getActivities = async (): Promise<Activity[]> => {
    return  await AppDataSource.getRepository(Activity).find({
        relations: {
            group: {
                exercise: true
            }
        }
    })
}

const updateActivity = async (activity: Activity): Promise<Activity> => {
    return await AppDataSource.getRepository(Activity).save(activity)
}

const createActivity = async (activity: Activity): Promise<Activity> => {
    const newActivity = AppDataSource.getRepository(Activity).create(activity)
    return await AppDataSource.getRepository(Activity).save(newActivity)
}

export default {
    getActivities,
    updateActivity,
    createActivity
}