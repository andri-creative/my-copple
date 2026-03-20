import "reflect-metadata";
import { MikroORM } from "@mikro-orm/mongodb";
import config from "./config/mikro-orm.config";

export const updateSchema = async () => {
  try {
    const orm = await MikroORM.init(config);
    await orm.getSchemaGenerator().updateSchema();
    console.log("Schema berhasil diperbarui di MongoDB!");
    await orm.close(true);
  } catch (error) {
    console.error("Error updating schema:", error);
  }
};

// Jika dijalankan manual via ts-node src/update-schema.ts
if (require.main === module) {
  updateSchema();
}