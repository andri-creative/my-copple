import { Entity, PrimaryKey, OneToOne, Property } from "@mikro-orm/core";
import { User } from "./User";

@Entity()
export class Role {
    @PrimaryKey()
    _id!: string

    @OneToOne(() => User)
    userId!: User

    @Property()
    role!: string

    @Property({onCreate: () => new Date() })
    createdAt!: Date

    @Property({onCreate: () => new Date(), onUpdate: () => new Date() })
    updatedAt!: Date
}