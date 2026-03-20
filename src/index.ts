import app from "./app";
import { updateSchema } from "./update-schema";

const start = async () => {
    // Jalankan update schema sebelum server listen
    await updateSchema();
    
    app.listen(9090, () => {
        console.log(`Server running at http://localhost:9090`);
    });
};

start();

export default app