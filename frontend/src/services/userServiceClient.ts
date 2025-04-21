import { User } from "../types";
const url = 'http://localhost:3000/user'
const createUser = async (user: User): Promise<User> => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error("Failed to create user");
    }
    const data = await response.json();
    return data.user;
}

const updateUser = async (user: User): Promise<User> => {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error("Failed to update user");
    }
    const data = await response.json();
    return data.user;
}

const getUsers = async (): Promise<User[]> => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (!response.ok) {
        throw new Error("Failed to get users")
    }
    const data = await response.json()
    return data.users;
}

export default {
    createUser,
    updateUser,
    getUsers
}