

const streams = [


   "https://live.channel8.com/Channel8-Kurdish/index.m3u8",
   "https://www.parsatv.com/embed.php?name=Kurdsat-TV&auto=false",
   "https://hlspackager.akamaized.net/live/DB/KURDSAT_NEWS/HLS/KURDSAT_NEWS.m3u8",
   "https://live.host247.net/gk/gksat/playlist.m3u8",
   "https://live.kirkuklive.live/hls/stream/index.m3u8",
   "https://media2.streambrothers.com:1936/8218/8218/HawezHD.m3u8",
   "http://avrstream.com:1935/live/SHARTV/HawezHD.m3u8",
   "https://hawezhd@svs.itworkscdn.net/rudawlive/rudawlive.smil/playlist.m3u8",
   "https://live9.karwan.tv/Spedtvyusfstore/index.m3u8",
   "https://live9.karwan.tv/Speddeamyusfstore/index.m3u8",
   "https://hawezhd@d1x82nydcxndze.cloudfront.net/live/index_720p25.m3u8",
   "https://hlspackager.akamaized.net/live/DB/AVA_TV/HLS/AVA_TV.m3u8",
   "https://media.streambrothers.com:1936/8226/8226/playlist.m3u8",
   "http://142.132.133.190:1935/live/NRT-SPORT-HawezHD/HawezHD.m3u8",
   "https://6476e46b58f91.streamlock.net/liveTrans/SHOWS123/HawezHD.m3u8",
   "https://avr.host247.net/Ranya/RanyaCity/playlist.m3u8"

];

/* CHANNEL NAMES */
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

/* ===================================
      LOAD STREAM (HLS / IFRAME)
=================================== */

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
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
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

/* ===================================
      FULLSCREEN MODE
=================================== */

function goFullScreen() {
    const c = document.getElementById("container");
    if (c.requestFullscreen) c.requestFullscreen();
}

/* ===================================
      REMOTE / KEYBOARD CONTROL
=================================== */

window.addEventListener("keydown", (e) => {

    if (e.key === "ArrowRight") {
        channel = (channel + 1) % streams.length;
        loadStream(channel);
        goFullScreen();
    }

    else if (e.key === "ArrowLeft") {
        channel = (channel - 1 + streams.length) % streams.length;
        loadStream(channel);
        goFullScreen();
    }

    else if (e.key === "Enter") {
        goFullScreen();
    }

    else if (e.key === "Escape" || e.key === "Backspace") {
        window.location.href = "index.html";
    }
});

/* LOAD FIRST CHANNEL */
loadStream(channel);
