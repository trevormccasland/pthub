import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

export enum PushUpPosition {
  STANDARD = "Standard (Toes)",
  KNEELING = "Kneeling (Modified)",
}

@Entity()
export class PushUpAssessment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // --- Relationships to the User Entity ---

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "trainerId" })
  trainer: User;

  // --- Assessment Details ---

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  assessmentDate: Date;

  @Column({
    type: "enum",
    enum: PushUpPosition,
    default: PushUpPosition.STANDARD,
    comment: "The position used by the client during the test (Standard or Kneeling)",
  })
  position: PushUpPosition;

  @Column({ type: "int", nullable: false })
  totalRepetitions: number;

  @Column({ type: "int", default: 60 })
  durationSeconds: number;

  @Column({ type: "text", nullable: true })
  formObservations: string;

  @Column({ type: "boolean", default: false })
  testTerminatedEarly: boolean;
}
