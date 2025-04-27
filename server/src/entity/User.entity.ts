import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Availability } from "./Availability.entity";

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

    @Column({unique: true, nullable: true })
    instagramHandle: string;

    @OneToMany<Availability>(() => Availability, 'userId')
    @JoinTable()
    availabilities: Availability[]
}