import express, { Express } from "express";
import { connectDtb } from "./config/database.config";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import methodOverride from "method-override";
dotenv.config();
const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(methodOverride("_method"));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.use(express.static("public"));

import { routeClinet } from "./router/client/index.route";
routeClinet(app);

connectDtb();

app.listen(port, () => {
    console.log(`Dang chay cong ${port}`);
});
