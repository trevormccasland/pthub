import { Request, Response } from "express";
import emailClient from "../services/emailClient";

const sendEmailResponse = async (req: Request, res: Response) => {
    const { from, to, subject, text } = req.body;
    try {
        await emailClient.sendEmail(from, to, subject, text);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
}

export default {
    sendEmailResponse
}