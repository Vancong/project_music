import { Express } from "express";
import { routerTopics } from "./topics.route";
import { routerSongs } from "./songs.route";
import { routeUser } from "./user.route";
import { routerFavourite } from "./favourite.route";
import * as checkMiddl from "../../middlewares/checkauthen.middlewares";
export const routeClinet = (app: Express) => {
    app.use(checkMiddl.user);
    app.use("/topics", routerTopics);
    app.use("/songs", routerSongs);
    app.use("/user", routeUser);
    app.use("/favourite", checkMiddl.Auth, routerFavourite);
};
