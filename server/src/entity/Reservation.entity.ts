import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm"
import { Availability } from "./Availability.entity"
import { User } from "./User.entity"
import { timezoneTransformer } from "./transformers"

@Entity()
@Unique(['availability', 'user'])
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    availabilityId: number

    @ManyToOne(() => Availability, availability => availability.reservations, {onDelete: 'CASCADE'})
    @JoinColumn()
    availability: Availability

    @Column()
    userId: number

    @ManyToOne(() => User, user => user.reservations, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User

    @Column({type: 'timestamp', transformer: timezoneTransformer()})
    date: Date
}