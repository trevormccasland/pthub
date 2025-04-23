
const url = 'http://localhost:3000'
const sendEmail = async (from: string, to: string, subject: string, text: string): Promise<string> => {
    const response = await fetch(`${url}/email/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from,
            to,
            subject,
            text,
        })
    });
    if (!response.ok) {
        throw new Error(`Error sending email: ${response.statusText}`);
    }
    const data = await response.json();
    return data.message;
}

export default {
    sendEmail
}