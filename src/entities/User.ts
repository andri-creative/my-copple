import { Entity, PrimaryKey, Property, OneToOne } from "@mikro-orm/core";

@Entity()
export class User {
    @PrimaryKey()
    _id!: string

    @Property()
    nickname!: string

    @Property({unique: true})
    email!: string

    @Property({ hidden: true })
    password!: string

    @Property()
    provider!: string

    @Property({ unique: true })
    code!: string

    @OneToOne({ entity: () => User, nullable: true })
    partner?: User

    @Property({onCreate: () => new Date() })
    createdAt!: Date

    @Property({onCreate: () => new Date(), onUpdate: () => new Date() })
    updatedAt!: Date
}