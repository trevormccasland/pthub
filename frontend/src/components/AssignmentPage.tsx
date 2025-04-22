import React, { FC, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import userServiceClient from "../services/userServiceClient";
import { User, UserRole } from "../types";
import { Autocomplete, Box, Button, Container, List, ListItem, ListItemIcon, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

const AssignmentPage: FC = () => {
    const [userGroups, setUserGroups] = useState<Record<keyof typeof UserRole, User[]>>({
        'ADMIN': [],
        'TRAINER': [],
        'USER': []
    })
    const [selectedClient, setSelectedClient] = useState<Record<number, User | null>>({})
    const [addedClients, setAddedClients] = useState<Record<number, User[]>>({})
    const handleAddClient = useCallback((trainerId: number) => {
        if (Object.keys(selectedClient).length > 0) {
            setAddedClients(prev => {
                const updated = {...prev}
                if (trainerId in updated) {
                    if (selectedClient[trainerId] !== null) {
                        updated[trainerId] = [...updated[trainerId], selectedClient[trainerId]]
                    }
                } else if (selectedClient[trainerId] !== null) {
                    updated[trainerId] = [selectedClient[trainerId]]
                }
                return updated
            })        
        }
        setSelectedClient((prev) => {
            const updated = {...prev}
            if (trainerId in updated) {
                updated[trainerId] = null
            }
            return updated
        })

    }, [selectedClient, setSelectedClient, setAddedClients])
    const handleUpdateClients = async () => {
        try {
            if (addedClients) {
                await userServiceClient.updateUsers(userGroups.TRAINER.reduce<User[]>((acc, trainer) => {
                    if (trainer.id !== undefined && trainer.id in addedClients) {
                        acc.push(
                            {
                                ...trainer,
                                clients: trainer.clients.concat(addedClients[trainer.id])
                            }
                        )
                    } else {
                        acc.push(trainer)
                    }
                    return acc
                }, []));
            }
            alert('Assignmets updated successfully!');
        } catch (error) {
            console.error('Error updating assignments:', error);
            alert('Failed to update assignments.');
        }
    }
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
        if (Object.values(addedClients).flat().some(update => update.id === user.id)) {
            return acc
        }
        acc.push(user)
        return acc
    }, []), [addedClients, userGroups.USER])
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
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
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
                            {trainer.clients.concat(trainer.id in addedClients ? addedClients[trainer.id] : []).map(user => (
                                <ListItem key={`${user.id}-${trainer.id}`}>
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