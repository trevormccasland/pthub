import React, { FC, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import userServiceClient from "../services/userServiceClient";
import { User, UserRole } from "../types";
import { Autocomplete, Box, Button, Container, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const AssignmentPage: FC = () => {
    const [userGroups, setUserGroups] = useState<Record<keyof typeof UserRole, User[]>>({
        'ADMIN': [],
        'TRAINER': [],
        'USER': []
    })
    const [selectedClient, setSelectedClient] = useState<Record<number, User | null>>({})
    const [clientChanges, setClientChanges] = useState<Record<number, { added: User[]; removed: User[] }>>({});
    const handleAddClient = useCallback((trainerId: number) => {
        if (selectedClient[trainerId]) {
            setClientChanges((prev) => {
                const updated = { ...prev };
                if (!updated[trainerId]) {
                    updated[trainerId] = { added: [], removed: [] };
                }
                // Add the client to the "added" list if not already present
                if (!updated[trainerId].added.some((client) => client.id === selectedClient[trainerId]?.id)) {
                    updated[trainerId].added.push(selectedClient[trainerId]!);
                }
                // Remove the client from the "removed" list if it exists there
                updated[trainerId].removed = updated[trainerId].removed.filter(
                    (client) => client.id !== selectedClient[trainerId]?.id
                );
                return updated;
            });
            setSelectedClient((prev) => {
                const updated = { ...prev };
                updated[trainerId] = null;
                return updated;
            });
        }
    }, [selectedClient]);
    const handleRemoveClient = useCallback((trainerId: number, client: User) => {
        setClientChanges((prev) => {
            const updated = { ...prev };
            if (!updated[trainerId]) {
                updated[trainerId] = { added: [], removed: [] };
            }
            // Add the client to the "removed" list if not already present
            if (!updated[trainerId].removed.some((removedClient) => removedClient.id === client.id)) {
                updated[trainerId].removed.push(client);
            }
            // Remove the client from the "added" list if it exists there
            updated[trainerId].added = updated[trainerId].added.filter((addedClient) => addedClient.id !== client.id);
            return updated;
        });
    }, []);
    const handleUpdateClients = async () => {
        try {
            if (clientChanges) {
                await userServiceClient.updateUsers(userGroups.TRAINER.reduce<User[]>((acc, trainer) => {
                    if (trainer.id !== undefined && clientChanges[trainer.id]) {
                        const { added, removed } = clientChanges[trainer.id];
                        acc.push({
                            ...trainer,
                            clients: trainer.clients
                                .filter((client) => !removed.some((removedClient) => removedClient.id === client.id))
                                .concat(added)
                        });
                    } else {
                        acc.push(trainer);
                    }
                    return acc;
                }, []));
            }
            alert('Assignments updated successfully!');
        } catch (error) {
            console.error('Error updating assignments:', error);
            alert('Failed to update assignments.');
        }
    };

    useEffect(() => {
        const callGetUsers = async () => {
            const allUsers = await userServiceClient.getUsers()
            const users: User[] = []
            const trainers: User[] = []
            const admins: User[] = []
            allUsers.forEach(user => {
                if (user.id) {
                    if (user.role === UserRole.USER) {
                        users.push(user)
                    } else if (user.role === UserRole.TRAINER) {
                        trainers.push(user)
                    } else if (user.role === UserRole.ADMIN) {
                        admins.push(user)
                    }
                }
            })
            setUserGroups({
                'TRAINER': trainers,
                'USER': users,
                'ADMIN': admins
            })
        }
        callGetUsers()
    }, [])
    const options = useMemo(() => userGroups.USER.reduce<User[]>((acc, user) => {
        if (Object.values(clientChanges).flatMap((change) => change.added).some((addedClient) => addedClient.id === user.id)) {
            return acc;
        }
        acc.push(user);
        return acc;
    }, []), [clientChanges, userGroups.USER]);
    return <Container>
        <Stack direction='column'>
            {userGroups.TRAINER.reduce<ReactElement[]>((result, trainer) => {
                if (trainer.id) {
                    result.push(<Box>
                        <Typography variant="h6">
                            {`Trainer ${trainer.firstName} ${trainer.lastName}`} 
                        </Typography>
                        
                        <Typography variant="h6">Clients</Typography>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName} ${option.email}`}
                            value={selectedClient[trainer?.id] ?? null}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(_, newValue) => setSelectedClient((prev) => {
                                const updated = {...prev}
                                if (trainer.id) {
                                    updated[trainer.id] = newValue as User
                                }
                                return updated
                            })}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth label='Name'/>
                            )}
                        />
                        <Button startIcon={<Add />} onClick={() => handleAddClient(trainer.id as number)}>
                            Add Client
                        </Button>
                        <List>
                            {trainer.clients
                                .filter(
                                    (client) =>
                                        (
                                            clientChanges[trainer.id!]?.removed.every(
                                                (removedClient) => removedClient.id !== client.id
                                            ) ?? true
                                        )
                                )
                                .concat(clientChanges[trainer.id]?.added || [])
                                .map((user) => (
                                    <ListItem
                                        key={`trainer-${trainer.id}-client-${user.id}`}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveClient(trainer.id as number, user)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText>
                                            {`Client ${user.firstName} ${user.lastName}`}
                                        </ListItemText>
                                    </ListItem>
                                ))}
                        </List>
                    </Box>)
                }
                return result
            }, [])}
        </Stack>
        <Stack direction="row-reverse" spacing={2}>
            <Button variant="contained" onClick={handleUpdateClients}>
                Update Clients
            </Button>
        </Stack>
    </Container>
}

export default AssignmentPage