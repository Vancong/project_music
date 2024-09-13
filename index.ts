import express, { Request, Response } from "express";
const app = express();
const port: number | string = 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Dang chay cong ${port}`);
});
