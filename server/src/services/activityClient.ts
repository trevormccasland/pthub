import { AppDataSource } from "../data-source"
import { Activity } from "../entity/Activity.entity"

const getActivities = async (): Promise<Activity[]> => {
    return  await AppDataSource.getRepository(Activity).find({
        relations: {
            group: true
        }
    })
}

const updateActivity = async (activity: Activity): Promise<Activity> => {
    return await AppDataSource.getRepository(Activity).save(activity)
}

export default {
    getActivities,
    updateActivity
}