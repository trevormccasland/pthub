import { AppDataSource } from "../data-source"
import { Activity } from "../entity/Activity.entity"

const getActivities = async (): Promise<Activity[]> => {
    return  await AppDataSource.getRepository(Activity).find({
        relations: {
            group: true
        }
    })
}

export default {
    getActivities
}