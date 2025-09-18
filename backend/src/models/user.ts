import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        unique: true,
        nullable: false
    })
    email!: string;

    @Column({
        nullable: true,
        unique: true
    })
    username!: string;

    @Column({
        nullable: false
    })
    password!: string;
}