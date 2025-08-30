import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "./user";

@Entity()
export class SleeperLeague {
    @PrimaryColumn()
    userId!: string;

    @ManyToOne(() => User, (user) => user.leagues)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @PrimaryColumn()
    league_id!: string;

    @Column({ nullable: true })
    saved_user!: string;
}