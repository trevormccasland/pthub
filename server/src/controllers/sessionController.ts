import { Request, Response } from "express";
import { createSession, getAllSessions } from "../services/sessionClient";

const createSessionResponse = async (req: Request, res: Response) => {
    try {
        const session = await createSession(req.body);
        res.status(201).json({session});
    } catch (error) {
        res.status(500).json({ message: "Failed to create session", error: (error as Error).message });
    }
};

const getSessionsResponse = async (req: Request, res: Response) => {
    try {
        const sessions = await getAllSessions();
        res.json({sessions});
    } catch (error) {
        res.status(500).json({ message: "Failed to get session", error: (error as Error).message });
    }
};

export default {
    createSessionResponse,
    getSessionsResponse
}