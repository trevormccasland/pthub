import { Request, Response } from "express";
import userClient from "../services/userClient";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";

export interface UserResponse {
    user: User
}

const getUserResponse = async (req: Request, res: Response<UserResponse>) => {
    const userId = parseInt(req.params.userId, 10)
    const user = await userClient.getUser(userId)
    res.json({ user });
}

const updateUserResponse = async (req: Request, res: Response<UserResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(User, body)
    const user = await userClient.updateUser(entity)
    res.json({user})
}

const createUserResponse = async (req: Request, res: Response<UserResponse>) => {
    const body = req.body
    const entity = AppDataSource.manager.create(User, body)
    const user = await userClient.createUser(entity)
    res.json({user})
}

export default {
    getUserResponse,
    updateUserResponse,
    createUserResponse
}