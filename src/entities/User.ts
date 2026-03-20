import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
    @PrimaryKey()
    _id!: string

    @Property()
    nickname!: string

    @Property({unique: true})
    email!: string

    @Property()
    pictures!: string

    @Property({onCreate: () => new Date() })
    createdAt!: Date

    @Property({onCreate: () => new Date(), onUpdate: () => new Date() })
    updatedAt!: Date
}