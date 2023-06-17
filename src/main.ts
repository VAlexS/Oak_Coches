import { Application, Router } from "oak";

import { nuevoCoche } from "./resolvers/post.ts";
import { removeCar } from "./resolvers/delete.ts";
import { getCar } from "./resolvers/get.ts";
import { askCar, releaseCar } from "./resolvers/put.ts";

const router = new Router();

router
    .post("/addCar", nuevoCoche)
    .delete("/removeCar/:id", removeCar)
    .get("/car/:id", getCar)
    .put("/askCar", askCar)
    .put("/releaseCar/:id", releaseCar)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

//obtengo el puerto del .env
const port = Number(Deno.env.get("PORT"));

await app.listen({port: port});