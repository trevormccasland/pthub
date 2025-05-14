import { Availability } from "../types";

const API_URL = "http://localhost:3000/availability"; // Adjust the URL as needed

const getAllAvailability = async (expanded?: boolean): Promise<Availability[]> => {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
        throw new Error("Failed to fetch availability data");
    }
    const data = await response.json();
    if(!expanded) {
        return data.availabilities;
    }
    
    const expandedAvailbility: Availability[] = [];
    data.availabilities.forEach((block: Availability) => {
        if (!block.repeatUntil) {
            expandedAvailbility.push(block);
            return;
        }
        const start = new Date(block.startDate);
        const end = new Date(block.repeatUntil);
        let current = new Date(start);
        while (current <= end) {
            // Clone the block and adjust the dates
            const newBlock = { ...block };
            newBlock.startDate = new Date(current);
            // Adjust startTime and endTime to match the new date
            const startTime = new Date(block.startTime);
            const endTime = new Date(block.endTime);
            newBlock.startTime = new Date(
                current.getFullYear(),
                current.getMonth(),
                current.getDate(),
                startTime.getHours(),
                startTime.getMinutes(),
                startTime.getSeconds()
            );
            newBlock.endTime = new Date(
                current.getFullYear(),
                current.getMonth(),
                current.getDate(),
                endTime.getHours(),
                endTime.getMinutes(),
                endTime.getSeconds()
            );
            expandedAvailbility.push(newBlock);
            // Move to next week (7 days)
            current.setDate(current.getDate() + 7);
        }
    });
    return expandedAvailbility;
}

const createAvailability = async (availability: Availability): Promise<Availability> => {
    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(availability),
    });
    if (!response.ok) {
        throw new Error("Failed to create availability");
    }
    const data = await response.json();
    return data.availability;
}

const updateAvailability = async (availability: Availability): Promise<Availability> => {
    const response = await fetch(`${API_URL}/${availability.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(availability),
    });
    if (!response.ok) {
        throw new Error("Failed to update availability");
    }
    const data = await response.json();
    return data.availability;
}
const deleteAvailability = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete availability");
    }
}


export default {
    getAllAvailability,
    createAvailability,
    updateAvailability,
    deleteAvailability,
}