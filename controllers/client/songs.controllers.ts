import { Request, Response } from "express";
import songDtb from "../../modules/songs.modules";
import topicDtb from "../../modules/topics.model";
import singerDtb from "../../modules/singer.modules";
// [GET] /songs/:slugTopic
export const index = async (req: Request, res: Response) => {
    try {
        const slug: string = req.params.slugTopic;
        const topic = await topicDtb
            .findOne({
                slug: slug,
                deleted: false,
                status: "active",
            })
            .select("title avatar like");
        if (!topic) {
            res.redirect("back");
            return;
        }

        const song = await songDtb
            .find({
                topicId: topic.id,
                deleted: false,
                status: "active",
            })
            .select("title avatar like singerId slug");

        for (const item of song) {
            const singerData = await singerDtb
                .findOne({
                    _id: item.singerId,
                })
                .select("fullName");
            item["singerFullName"] = singerData["fullName"];
        }
        res.render("client/page/songs/list.pug", {
            pageTitle: "Danh sach bai hat",
            songs: song,
        });
    } catch (error) {
        res.redirect("back");
    }
};

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
    try {
        const slugSong = req.params.slugSong;
        const song = await songDtb.findOne({
            slug: slugSong,
        });

        const singer = await singerDtb
            .findOne({
                _id: song.singerId,
            })
            .select("fullName");
        const topic = await topicDtb
            .findOne({
                _id: song.topicId,
            })
            .select("title");
        res.render("client/page/songs/detail", {
            pageTitle: "Chi tiet bai hat",
            song: song,
            topic: topic,
            singer: singer,
        });
    } catch (error) {
        res.redirect("back");
    }
};
