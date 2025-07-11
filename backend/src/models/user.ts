import { Column, Entity, ForeignKey, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        unique: true,
        nullable: false
    })
    email!: string

    @Column({
        nullable: true,
        unique: true
    })
    username!: string

    @Column({
        nullable: false
    })
    password!: string

    @OneToMany(() => UserLeagues, (userLeague) => userLeague.user, { cascade: true })
    leagues!: UserLeagues[];
}

@Entity()
export class UserLeagues {
    @PrimaryColumn()
    userId!: string

    @ManyToOne(() => User, (user) => user.leagues)
    @JoinColumn({ name: 'userId' })
    user!: User

    @Column()
    platform!: string

    @PrimaryColumn()
    league_id!: string

}