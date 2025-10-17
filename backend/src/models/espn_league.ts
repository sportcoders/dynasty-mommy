import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { EspnCookies } from "./espn_cookies";

@Entity()
export class EspnLeague {
    // Our application's user id
    @PrimaryColumn()
    userId!: string;

    // The league id
    @PrimaryColumn()
    leagueId!: string;

    // If a user is deleted from the User table, then its associated Espn Leagues will also delete
    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;
}
