import express, { Request, Response } from "express";
import topicDtb from "../../modules/topics.model";
export const index = async (req: Request, res: Response) => {
    const topics = await topicDtb.find({
        deleted: false,
        status: "active",
    });
    res.render("client/page/topics/index.pug", {
        pageTitle: "Danh sách chủ đề",
        topics: topics,
    });
};
