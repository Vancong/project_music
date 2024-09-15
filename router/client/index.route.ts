import { Express } from "express";
import { routerTopics } from "./topics.route";
import { routerSongs } from "./songs.route";
export const routeClinet = (app: Express) => {
    app.use("/topics", routerTopics);
    app.use("/songs", routerSongs);
};
