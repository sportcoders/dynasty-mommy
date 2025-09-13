import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class YahooLeague {
    @PrimaryColumn()
    userId!: string;

    @PrimaryColumn()
    league_key!: string;

    @Column({ nullable: true })
    team_key!: string;

}