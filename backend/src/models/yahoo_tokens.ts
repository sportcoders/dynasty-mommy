import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class YahooToken {
    @PrimaryColumn()
    userId!: string;

    @Column()
    access_token!: string;

    @Column()
    access_token_expiry!: Date;

    @Column()
    refresh_token!: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user!: User;
}