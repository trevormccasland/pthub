import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Exercise {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({nullable: true})
    type: string

    @Column({nullable: true})
    level: string

    @Column({nullable: true})
    load: number

    @Column({nullable: true})
    url: string

    @Column({nullable: true})
    sets: number

    @Column({nullable: true})
    reps: number

    @Column({nullable: true})
    time: number

    @Column({nullable: true})
    rest: number

    @Column({nullable: true})
    tempo: string

    @Column({nullable: true})
    notes: string
}
