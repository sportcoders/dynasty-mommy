import { Entity, PrimaryColumn, Column } from "typeorm";

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
}