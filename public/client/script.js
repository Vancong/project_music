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
// favourite