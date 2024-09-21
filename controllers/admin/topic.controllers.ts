import { Request, Response } from "express";
import topicDtb from "../../modules/topics.model";
// [GET] /admin/topic
export const index = async (req: Request, res: Response) => {
    const topics = await topicDtb.find({
        deleted: false,
        status: "active",
    });
    res.render("admin/page/topic/index", {
        pageTitle: "Chủ đề",
        topics: topics,
    });
};
