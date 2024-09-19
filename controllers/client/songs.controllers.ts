import { Request, Response } from "express";
import songDtb from "../../modules/songs.modules";
import topicDtb from "../../modules/topics.model";
import singerDtb from "../../modules/singer.modules";
import favoriteSongDtb from "../../modules/favorite-song.moudels";
import likeSongDtb from "../../modules/like-song.modules";
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
            .select("title avatar  singerId slug");

        for (const item of song) {
            const singerData = await singerDtb
                .findOne({
                    _id: item.singerId,
                })
                .select("fullName");
            item["singerFullName"] = singerData["fullName"];
            const totalLike = await likeSongDtb.findOne({
                songId: item.id,
            });
            let like = 0;
            if (totalLike) {
                like = totalLike.like.length;
            }
            item["like"] = like + 2815;
        }
        res.render("client/page/songs/list.pug", {
            pageTitle: "Danh sach bai hat",
            songs: song,
        });
    } catch (error) {
        res.redirect("back");
    }
};

// [PATCH] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
    try {
        const slugSong = req.params.slugSong;
        const song = await songDtb.findOne({
            slug: slugSong,
        });

        const totalLike = await likeSongDtb.findOne({
            songId: song.id,
        });
        let like = 0;
        if (totalLike) {
            like = totalLike.like.length;
        }
        song["like"] = like + 2815;

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

        let favourite = "";
        let checkLike = "";
        let user = res.locals.user;
        if (user) {
            const checkFavourite = await favoriteSongDtb.findOne({
                userId: user.id,
                songId: song.id,
            });
            if (checkFavourite) {
                favourite = "1";
            }

            const checkLikeDtb = await likeSongDtb.findOne({
                songId: song.id,
                like: user.id,
            });

            if (checkLikeDtb) {
                checkLike = "1";
            }
        }

        res.render("client/page/songs/detail", {
            pageTitle: "Chi tiet bai hat",
            song: song,
            topic: topic,
            singer: singer,
            checkLike: checkLike,
            favourite: favourite,
        });
    } catch (error) {
        res.redirect("back");
    }
};

// [PATCH] /songs/like
export const like = async (req: Request, res: Response) => {
    const id = req.body.id;
    const user = res.locals.user;

    // check xem user da like songId nay chua
    const likeSongUser = await likeSongDtb.findOne({
        songId: id,
        like: user.id,
    });

    //check xem songId nay da ton tai trong dtb chua
    const likeSong = await likeSongDtb.findOne({
        songId: id,
    });
    let status = "";
    if (!likeSong) {
        status = "like";
        const data = {
            songId: id,
            like: [user.id],
        };
        const newLikeSong = new likeSongDtb(data);
        await newLikeSong.save();
    } else {
        if (!likeSongUser) {
            status = "like";
            await likeSongDtb.updateOne(
                {
                    songId: id,
                },
                {
                    $push: {
                        like: user.id,
                    },
                }
            );
        } else {
            status = "dislike";
            await likeSongDtb.updateOne(
                {
                    songId: id,
                },
                {
                    $pull: {
                        like: user.id,
                    },
                }
            );
        }
    }

    let like = 0;
    if (likeSong) {
        const likeDb = await likeSongDtb.findOne({
            songId: id,
        });
        like = likeDb.like.length;
    }
    like += 2185;
    res.json({
        code: 200,
        status: status,
        like: like,
    });
};
