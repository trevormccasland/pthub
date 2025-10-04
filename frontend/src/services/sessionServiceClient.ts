import { CreateSessionData, Session } from "../types";

const API_URL = `http://localhost:3000/session`;

const createSession = async (sessionData: CreateSessionData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
    });
    if (!response.ok) {
        throw new Error("Failed to create session");
    }
    const data = await response.json();
    return data.session;
}

const getSessions = async (): Promise<Session[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch sessions");
    }
    const data = await response.json();
    return data.sessions;
}

export default {
   createSession 
}