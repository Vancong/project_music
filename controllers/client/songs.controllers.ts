import { Request, Response } from "express";
import songDtb from "../../modules/songs.modules";
import topicDtb from "../../modules/topics.model";
import singerDtb from "../../modules/singer.modules";
import favoriteSongDtb from "../../modules/favorite-song.moudels";
import likeSongDtb from "../../modules/like-song.modules";
import unidecode from "unidecode";
// [GET] /songs/:slugTopic
// export const index = async (req: Request, res: Response) => {
//     try {
//         const slug: string = req.params.slugTopic;
//         const topic = await topicDtb
//             .findOne({
//                 slug: slug,
//                 deleted: false,
//                 status: "active",
//             })
//             .select("title avatar like");

//         const song = await songDtb
//             .find({
//                 topicId: topic.id,
//                 deleted: false,
//                 status: "active",
//             })
//             .select("title avatar  singerId slug");

//         for (const item of song) {
//             const singerData = await singerDtb
//                 .findOne({
//                     _id: item.singerId,
//                 })
//                 .select("fullName");
//             item["singerFullName"] = singerData["fullName"];
//             const totalLike = await likeSongDtb.findOne({
//                 songId: item.id,
//             });
//             let like = 0;
//             if (totalLike) {
//                 like = totalLike.like.length;
//             }
//             item["like"] = like + 2815;
//         }
//         res.render("client/page/songs/list.pug", {
//             pageTitle: "Danh sach bai hat",
//             songs: song,
//         });
//     } catch (error) {}
// };

export const index = async (req: Request, res: Response) => {
    const slugTopic = req.params.slugTopic;
    const topic = await topicDtb.findOne({
        slug: slugTopic,
        deleted: false,
        status: "active",
    });
    // console.log(topic);
    if (!topic) {
        const referrer = req.get("Referrer") || "/";
        res.redirect(referrer);
        return;
    }
    const songs = await songDtb
        .find({
            topicId: topic.id,
            deleted: false,
            status: "active",
        })
        .select("title avatar singerId like slug");
    for (const item of songs) {
        const singerInfo = await singerDtb
            .findOne({
                _id: item.singerId,
            })
            .select("fullName");
        item["singerFullName"] = singerInfo["fullName"];
    }
    res.render("client/page/songs/list", {
        pageTitle: topic.title,
        songs: songs,
    });
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

// [GET] /songs/search
export const search = async (req: Request, res: Response) => {
    const type = req.params.type;
    const keyword = `${req.query.keyword}`.trim();
    let songFinal = [];
    if (keyword) {
        // tìm theo tên ca sĩ
        let singer = keyword;
        singer = unidecode(singer);
        let regexSinger = new RegExp(singer, "i");
        let singerSlug = singer.replace(/\s/g, "-");
        singerSlug = singerSlug.replace(/-+/g, "-");
        let regexSingerSlug = new RegExp(singerSlug, "i"); //"i " k phan biet chu hoa hay chu thuong
        let dataSinger = await singerDtb.find({
            $or: [
                {
                    fullName: regexSinger,
                },
                {
                    slug: regexSingerSlug,
                },
            ],
            deleted: false,
            status: "active",
        });
        const IdSinger = dataSinger.map((item) => item.id); // lay ra mang id singer co ten nhu the

        // tìm theo tên bài hát
        const regexTitle = new RegExp(keyword, "i");
        let keywordSlug = keyword;
        keywordSlug = unidecode(keyword); // bỏ dấu
        keywordSlug = keywordSlug.replace(/\s/g, "-"); // \s ki tu khoang cach  thay the "-"
        keywordSlug = keywordSlug.replace(/-+/g, "-"); // tim tat ca dau tru và thay thế

        const regexSlug = new RegExp(`${keywordSlug}`, "i");
        const songs = await songDtb
            .find({
                $or: [
                    {
                        title: regexTitle,
                    },
                    {
                        slug: regexSlug,
                    },
                    {
                        singerId: { $in: IdSinger },
                    },
                ],
                deleted: false,
                status: "active",
            })
            .select("title avatar singerId like slug");

        for (const item of songs) {
            const singerInfo = await singerDtb
                .findOne({
                    _id: item.singerId,
                })
                .select("fullName");
            // tra ve theo api phai tao ra object moi, khong duoc dung object cua dtb || bao mat
            const itemFinal = {
                title: item.title,
                avatar: item.avatar,
                like: item.like,
                slug: item.slug,
                singerId: item.singerId,
                singerFullName: singerInfo["fullName"],
            };
            songFinal.push(itemFinal);
        }
    }

    if (type == "result") {
        res.render("client/page/songs/list.pug", {
            pageTitle: `Kết quả tìm kiếm : ${keyword}`,
            keyword: keyword,
            songs: songFinal,
        });
    } else if (type == "suggest") {
        res.json({
            code: 200,
            songs: songFinal,
        });
    } else {
        res.json({
            code: 400,
        });
    }
};
