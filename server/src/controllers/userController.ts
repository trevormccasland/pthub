import { Request, Response } from "express";
import userClient from "../services/userClient";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";

export interface UserResponse {
    user?: User
    error?: string
}

export interface UsersResponse {
    users: User[]
}

export type UserRequestBody = UsersResponse

const getUserByIdResponse = async (req: Request, res: Response<UserResponse>) => {
    const userId = parseInt(req.params.userId, 10)
    const user = await userClient.getUser(userId)
    if (!user) {
        res.status(404).json({ error: "User not found" })
        return
    }
    res.json({ user });
}

const getUsersResponse = async (req: Request, res: Response<UsersResponse>) => {
    const users = await userClient.getUsers()
    res.json({ users });
}

const updateUsersResponse = async (req: Request<User[]>, res: Response<UsersResponse>) => {
    const body: User[] = req.body
    const entities = body.map(item => AppDataSource.manager.create(User, item))
    const users = await userClient.updateUsers(entities)
    res.json({users})
}

const createUserResponse = async (req: Request, res: Response<UserResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(User, {
        ...body,
        instagramHandle: body.instagramHandle || null,
    })
    const user = await userClient.createUser(entity)
    res.json({user})
}

export default {
    getUserByIdResponse,
    updateUsersResponse,
    createUserResponse,
    getUsersResponse
}