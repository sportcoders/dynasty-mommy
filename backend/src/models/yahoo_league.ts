import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user";
import { YahooToken } from "./yahoo_tokens";

@Entity()
export class YahooLeague {

    @PrimaryColumn()
    userId!: string;

    @PrimaryColumn()
    league_key!: string;

    @Column()
    yahoo_token_userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne(() => YahooToken, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'yahoo_token_userId' })
    yahooToken!: YahooToken;
}