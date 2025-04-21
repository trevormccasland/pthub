import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    TRAINER = 'TRAINER'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({type: 'varchar', length: 7})
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany<User>(() => User)
    @JoinTable()
    clients: User[]
}