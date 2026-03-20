import { Entity, PrimaryKey, OneToOne, Property } from "@mikro-orm/core";
import { User } from "./User";

@Entity()
export class Profils{
    @PrimaryKey()
    _id!: string
    
    @OneToOne(() => User)
    userId!: User

    @Property()
    bio!: string

    @Property()
    gender!: string

    @Property()
    birthDate!: Date

    @Property()
    pictures!: string
    
    @Property({onCreate: () => new Date() })
    createdAt!: Date

    @Property({onCreate: () => new Date(), onUpdate: () => new Date() })
    updatedAt!: Date
}