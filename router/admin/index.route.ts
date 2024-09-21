import { Express } from "express";
import { systemConfig } from "../../config/system.config";
import { routerDashboard } from "./dashboard.route";
import { routerTopic } from "./topic.route";
import { routerSong } from "./song.route";
export const routeAdmin = (app: Express) => {
    const prefixAdmin = systemConfig.prefixAdmin;
    app.use(`/${prefixAdmin}/dashboard`, routerDashboard);
    app.use(`/${prefixAdmin}/topics`, routerTopic);
    app.use(`/${prefixAdmin}/songs`, routerSong);
};
