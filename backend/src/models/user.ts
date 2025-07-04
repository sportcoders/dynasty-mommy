import mongoose from "mongoose";
import { Column, Entity, ForeignKey, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String
//     },
//     password: {
//         type: String
//     },
//     leagues: [{
//         platform: { type: String },
//         id: { type: String }
//     }]
// },)

// const User = mongoose.model("user", userSchema)
@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    email!: string

    @Column({
        nullable: true
    })
    username!: string

    @Column()
    password!: string

    @OneToMany(() => UserLeagues, (userLeague) => userLeague.user)
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