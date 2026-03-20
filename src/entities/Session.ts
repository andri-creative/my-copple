import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "./User";

@Entity()
export class Session {
    @PrimaryKey()
    _id!: string

    @ManyToOne(() => User)
    userId!: User

    @Property()
    token!: string

    @Property({ nullable: true })
    device?: string

    @Property({ nullable: true })
    ipAddress?: string

    @Property({ default: false })
    isRevoked: boolean = false

    @Property()
    expiresAt!: Date

    @Property({onCreate: () => new Date() })
    createdAt!: Date

    @Property({onCreate: () => new Date(), onUpdate: () => new Date() })
    updatedAt!: Date
}
