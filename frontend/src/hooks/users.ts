import { useEffect, useState } from "react"
import { User, UserRole } from "../types"
import userServiceClient from "../services/userServiceClient"

export const useUserGroups = (): Record<keyof typeof UserRole, User[]> => {
    const [userGroups, setUserGroups] = useState<Record<keyof typeof UserRole, User[]>>({
        'ADMIN': [],
        'TRAINER': [],
        'USER': []
    })
    useEffect(() => {
        const callGetUsers = async () => {
            const allUsers = await userServiceClient.getUsers()
            const users: User[] = []
            const trainers: User[] = []
            const admins: User[] = []
            allUsers.forEach(user => {
                if (user.id) {
                    if (user.role === UserRole.USER) {
                        users.push(user)
                    } else if (user.role === UserRole.TRAINER) {
                        trainers.push(user)
                    } else if (user.role === UserRole.ADMIN) {
                        admins.push(user)
                    }
                }
            })
            setUserGroups({
                'TRAINER': trainers,
                'USER': users,
                'ADMIN': admins
            })
        }
        callGetUsers()
    }, [])
    return userGroups
}