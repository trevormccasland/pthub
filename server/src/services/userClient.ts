import { AppDataSource } from "../data-source"
import { User } from "../entity/User.entity"

const createUser = async (user: User): Promise<User> => {
    const newUser = AppDataSource.getRepository(User).create(user)
    return await AppDataSource.getRepository(User).save(newUser)
}

const getUser = async (id: number): Promise<User | null> => {
    const user = await AppDataSource.getRepository(User).find(
        {
            where: { id },
            relations: {
                clients: true,
                availabilities: true,
                reservations: true
            }
        }
    )
    return user.length > 0 ? user[0] : null
}

const getUsers = async (): Promise<User[]> => {
    const users = await AppDataSource.getRepository(User).find({
        relations: {
            clients: true,
            availabilities: true,
            reservations: true
        }
    })
    return users
}

const updateUsers = async (users: User[]): Promise<User[]> => {
    return await AppDataSource.getRepository(User).save(users)
}

export default {
    createUser,
    getUser,
    getUsers,
    updateUsers
}