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

    // TODO: If ESPN unlinks from user, then delete its associated Espn Leagues will also delete
    // Different users can link the same ESPN account
    // Unique composite key: userId & leagueId & SWID
    // When user unlinks, SWID changes or is not defined.
    @ManyToOne(() => EspnCookies, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cookieUserId", referencedColumnName: "userId" })
    cookie!: EspnCookies;
}
