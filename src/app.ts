import express from "express";
import { updateSchema } from "./update-schema";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import coupleRoutes from "./routes/coupleRoutes";
import { MikroORM, RequestContext } from "@mikro-orm/mongodb";

export const DI = {} as {
  orm: MikroORM;
};

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  if (DI.orm) {
    RequestContext.create(DI.orm.em, next);
  } else {
    next();
  }
});

app.use("/v1/auth", authRoutes);
app.use("/v1/profile", profileRoutes);
app.use("/v1/couple", coupleRoutes);

app.get('/', (req, res) => {
    res.json({
        message: "Copple my",
        status: false,
        data: {
            name: "Copple",
            version: "1.0.0",
        }
    })
})

export default app;