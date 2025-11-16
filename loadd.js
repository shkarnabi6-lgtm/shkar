const streams = [
   "https://live.channel8.com/Channel8-Kurdish/index.m3u8",
   "https://live9.karwan.tv/Kurdsattvyusfstore/index.m3u8",
   "https://live.karwan.tv/kurdsat-news-tv/index.m3u8?token=b081e709a8d8a8ec1cf7d65bf9bb3ab90dd57115-eb2d2c54275d23d8bead04b9f06e97da-1763334490-1763323690&remote=no_check_ip",
   // more streams...
];

const channelNames = [
   "Channel 8", "Kurdsat HD", "Kurdsat News", "Gali Kurdistan", "Kirkuk HD",
   "Payam HD", "Shar TV", "Rudaw HD", "Speda HD", "Speda Drama",
   "K24 HD", "AVA Media", "NRT News", "NRT Sport", "Kurdmax TV", "Ranya City",
   "YouTube Sample"
];

const video = document.getElementById("video");
const frame = document.getElementById("frame");
const channelNameBox = document.getElementById("channelName");

let hls;
let channel = parseInt(new URLSearchParams(window.location.search).get("channel")) || 0;

function showChannelName(name) {
    channelNameBox.textContent = name;
    channelNameBox.style.opacity = 1;
    channelNameBox.style.transform = "translateX(-50%) scale(1.25)";
    setTimeout(() => {
        channelNameBox.style.opacity = 0;
        channelNameBox.style.transform = "translateX(-50%) scale(1)";
    }, 4000);
}

function loadStream(id) {
    const url = streams[id];
    showChannelName(channelNames[id]);

    if (url.endsWith(".m3u8")) {
        // VIDEO MODE
        frame.style.display = "none";
        video.style.display = "block";

        if (hls) hls.destroy();

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Check if the stream has actually loaded
                if (video.readyState >= 3) {
                    video.play();
                } else {
                    console.error("Failed to load the stream.");
                }
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    console.error("HLS.js error: ", data);
                }
            });
        } else {
            video.src = url;
            video.play();
        }

    } else {
        // IFRAME MODE
        if (hls) hls.destroy();
        video.pause();

        video.style.display = "none";
        frame.style.display = "block";
        frame.src = url;
    }
}

function goFullScreen() {
    const c = document.getElementById("container");
    if (c.requestFullscreen) c.requestFullscreen();
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        channel = (channel + 1) % streams.length;
        loadStream(channel);
        goFullScreen();
    } else if (e.key === "ArrowLeft") {
        channel = (channel - 1 + streams.length) % streams.length;
        loadStream(channel);
        goFullScreen();
    } else if (e.key === "Enter") {
        goFullScreen();
    } else if (e.key === "Escape" || e.key === "Backspace") {
        window.location.href = "index.html";
    }
});

// Load the first stream on initial load
loadStream(channel);
