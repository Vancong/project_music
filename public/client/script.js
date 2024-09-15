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