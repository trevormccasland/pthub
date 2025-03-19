import { FC } from "react"
import { Activity, isExercise, isSuperset } from "../types"
import ExerciseCard from "./ExerciseCard"
import SuperSetActivityCard from "./SuperSetActivityCard"

interface ActivityCardProps {
    activity: Activity
}

const ActivityCard: FC<ActivityCardProps> = ({activity}: ActivityCardProps) => {
    if (isExercise(activity)) {
        return <ExerciseCard exercise={activity} />
    }
    if (isSuperset(activity)) {
        return <SuperSetActivityCard exercise1={activity.group[0]} exercise2={activity.group[1]} />
    }
    return null
}

export default ActivityCard