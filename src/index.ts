import app, { DI } from "./app";
import { updateSchema } from "./update-schema";
import { MikroORM } from "@mikro-orm/mongodb";
import config from "./config/mikro-orm.config";

const start = async () => {
    await updateSchema();
    
    // Biarkan database menyala terus untuk melayani Requests!
    DI.orm = await MikroORM.init(config);
    
    app.listen(9090, () => {
        console.log(`Server running at http://localhost:9090`);
    });
};

start();

export default app;