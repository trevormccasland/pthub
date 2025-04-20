import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    TRAINER = 'trainer'
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
}