const song = document.getElementById('aplayer');
if (song) {
    const singer = JSON.parse(song.getAttribute("data-singer"));
    const dataSong = JSON.parse(song.getAttribute("data-song"));
    const ap = new APlayer({
        container: document.getElementById('aplayer'),
        autoplay: true,
        audio: [{
            name: `${dataSong.title}`,
            artist: `${singer.fullName}`,
            url: `${dataSong.audio}`,
            cover: `${dataSong.avatar}`
        }]
    });
    const avt = document.querySelector(".singer-detail .inner-avatar");
    ap.on("play", () => {
        avt.style.animationPlayState = 'running';
        const time = ap.audio.duration * 1 / 5 * 1000;
        setTimeout(() => {
            ap.on('ended', () => {
                const data = {
                    songId: songId
                }
                fetch(`/songs/listen`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code == 200) {
                            const boxAction = document.querySelector(".inner-action.inner-listen");
                            const innerListen = boxAction.querySelector(".inner-number");
                            innerListen.innerHTML = `${data.listen}`;
                        }
                    })
            });
        }, time);
    })

    ap.on("pause", () => {
        avt.style.animationPlayState = 'paused';
    });

    const songId = document.querySelector("[songId]").getAttribute("songId");

}

// like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
    buttonLike.addEventListener("click", () => {

        const id = buttonLike.getAttribute("button-like");
        const data = {
            id: id
        }
        fetch(`/songs/like`, {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    const like = document.querySelector(".inner-number");
                    like.innerHTML = `${data.like}`;

                    const iconLike = buttonLike.querySelector(".inner-like");
                    if (data.status == "like") {
                        buttonLike.classList.add("active");

                        iconLike.classList.add("active");
                    } else {
                        buttonLike.classList.remove("active");

                        iconLike.classList.remove("active");
                    }

                }
            })
    })
}
//end like

// favourite
const listButtonFavourite = document.querySelectorAll("[button-favourite]");
if (listButtonFavourite) {
    listButtonFavourite.forEach((buttonFavourite) => {
        buttonFavourite.addEventListener("click", () => {
            const id = buttonFavourite.getAttribute("button-favourite");
            const data = {
                id: id
            }
            fetch("/favourite", {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.code == 200) {

                        if (data.status == "tym") {

                            buttonFavourite.classList.add("active");
                        } else {
                            buttonFavourite.classList.remove("active");
                        }

                    }
                })
        })
    });

}
//end favourite

// goi y tim kiem
const boxSearch = document.querySelector('.box-search');
if (boxSearch) {
    const inputSearch = boxSearch.querySelector(`input[name='keyword']`);
    inputSearch.addEventListener("keyup", () => {
        const keyword = inputSearch.value;

        fetch(`/songs/search/suggest?keyword=${keyword}`)
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    const htmlSong = data.songs.map(item => `
                        <a class="inner-item" href="/songs/detail/${item.slug}">
                          <div class="inner-image">
                            <img src="${item.avatar}">
                          </div>
                          <div class="inner-info">
                            <div class="inner-title">${item.title}</div>
                            <div class="inner-singer">
                              <i class="fa-solid fa-microphone-lines"></i> ${item.singerFullName}
                            </div>
                          </div>
                        </a>
                      `);
                    const innerSuggest = boxSearch.querySelector(".inner-suggest");
                    const innerList = innerSuggest.querySelector(".inner-list");
                    innerList.innerHTML = htmlSong.join("");
                    if (data.songs.length > 0) {
                        innerSuggest.classList.add("show");
                    } else {
                        innerSuggest.classList.remove("show");
                    }
                }
            })
    })
}

//end goi y tim kiem