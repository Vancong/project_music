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
    })
    ap.on("pause", () => {
        avt.style.animationPlayState = 'paused';
    })
}

// like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
    buttonLike.addEventListener("click", () => {
        const active = buttonLike.classList.contains("active");
        let type = "";

        if (!active) {
            buttonLike.classList.add("active");
            type = "like"
        } else {
            buttonLike.classList.remove("active");
            type = "dislike";
        }
        const id = buttonLike.getAttribute("button-like");
        const data = {
            id: id,
            type: type
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
                    like.innerHTML = `${data.like}`
                } else {
                    console.log('ok');
                }
            })
    })
}
//end like

// favourite
const buttonFavourite = document.querySelector("[button-favourite]");
if (buttonFavourite) {
    buttonFavourite.addEventListener("click", () => {
        buttonFavourite.classList.add("active");
        const id = buttonFavourite.getAttribute("button-favourite");
        const data = {
            id: id
        }
        fetch("/songs/favourite", {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    buttonFavourite.classList.remove("active");
                }
            })
    })
}
// favourite