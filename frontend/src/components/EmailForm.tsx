import { FC, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

interface EmailFormProps {
    open: boolean;
    onClose: () => void;
    recipientEmail: string;
}

const EmailForm: FC<EmailFormProps> = ({ open, onClose, recipientEmail }) => {
    const [emailContent, setEmailContent] = useState({
        subject: "",
        body: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEmailContent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleCancel = () => {
        setEmailContent({ subject: "", body: "" });
        onClose();
    }
    const handleSendEmail = () => {
        const callSendEmail = async () => {
            // TODO: Replace with actual email sending logic
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
                emailContent.subject
            )}&body=${encodeURIComponent(emailContent.body)}`;
            window.location.href = mailtoLink;        }
        callSendEmail().then((message) => {
            console.log(message);
        }).catch((error) => {
            console.error("Error sending email:", error);
        });
        setEmailContent({ subject: "", body: "" });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Send Email to {recipientEmail}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Subject"
                    name="subject"
                    value={emailContent.subject}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Body"
                    name="body"
                    value={emailContent.body}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSendEmail} color="primary" variant="contained">
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailForm;