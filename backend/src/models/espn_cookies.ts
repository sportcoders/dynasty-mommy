import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { encrypt, decrypt } from "../utils/symmetric_encryption";

@Entity()
export class EspnCookies {
    // Our application's user id to link with the swid and espn_s2
    @PrimaryColumn()
    userId!: string;

    // The SWID cookie (unique ESPN user id)
    @Column()
    swid!: string;

    // The espn_s2 cookie (long session token string)
    @Column({
        transformer: {
            to: (value: string) => encrypt(value),   // encrypt before saving
            from: (value: string) => decrypt(value), // decrypt when loading
        }
    })
    espn_s2!: string;

    // Track updates to the cookies
    @Column()
    lastUpdated!: Date;

    // If a user is deleted from the User table, then its associated Espn Cookies will also delete
    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;
}
