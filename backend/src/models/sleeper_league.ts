import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "./user";

@Entity()
export class SleeperLeague {
    @PrimaryColumn()
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @PrimaryColumn()
    league_id!: string;

    @Column({ nullable: true })
    saved_user!: string;
}