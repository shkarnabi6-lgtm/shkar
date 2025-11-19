//
const streams = [
        "https://live.channel8.com/Channel8-Kurdish/index.m3u8",
        "https://live9.karwan.tv/Kurdsattvyusfstore/index.m3u8",
        "https://www.parsatv.com/embed.php?name=Kurdsat-News&auto=true",
        "https://live.host247.net/gk/gksat/playlist.m3u8",
        "https://live.kirkuklive.live/hls/stream/index.m3u8",
        "https://media2.streambrothers.com:1936/8218/8218/HawezHD.m3u8",
        "http://avrstream.com:1935/live/SHARTV/HawezHD.m3u8",
        "https://hawezhd@svs.itworkscdn.net/rudawlive/rudawlive.smil/playlist.m3u8",
        "https://live9.karwan.tv/Spedtvyusfstore/index.m3u8",
        "https://live9.karwan.tv/Speddeamyusfstore/index.m3u8",
        "https://live.karwan.tv/kurdistan24-tv/index.mpd",
        "https://hlspackager.akamaized.net/live/DB/AVA_TV/HLS/AVA_TV.m3u8",
        "https://media.streambrothers.com:1936/8226/8226/playlist.m3u8",
        "http://142.132.133.190:1935/live/NRT-SPORT-HawezHD/HawezHD.m3u8",
        "https://www.parsatv.com/embed.php?name=Kurdmax-Show&auto=true",
        "https://avr.host247.net/Ranya/RanyaCity/playlist.m3u8",
    ];

    const channelNames = [
        "Channel 8", "Kurdsat HD", "Kurdsat News", "Gali Kurdistan", "Kirkuk HD",
        "Payam HD", "Shar TV", "Rudaw HD", "Speda HD", "Speda Drama",
        "K24 HD", "AVA Media", "NRT News", "NRT Sport", "Kurdmax Show", "Ranya City"
    ];

    const video = document.getElementById("video");
    const frame = document.getElementById("frame");
    const channelNameBox = document.getElementById("channelName");

    let hls;
    let channel = parseInt(new URLSearchParams(window.location.search).get("channel")) || 0;

    function showChannelName(name) {
        channelNameBox.textContent = name;
        channelNameBox.style.opacity = 1;
    }

    /* ====================
       LOAD STREAM
       ==================== */
    function loadStream(id) {
        const url = streams[id];
        showChannelName(channelNames[id]);

        // Reset previous video/iframe sources and styles
        if (frame.src) frame.src = ""; // Clear iframe source
        if (hls) { hls.destroy(); hls = null; } // Destroy HLS instance for video

        // Reset display styles to hide both elements initially
        video.style.display = "none";
        frame.style.display = "none";

        if (url.includes(".m3u8")) {
            // If the stream is a video (.m3u8), show the video player
            video.style.display = "block";

            if (Hls.isSupported()) {
                hls = new Hls({ autoStartLoad: true });
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    setTimeout(() => video.play(), 100);
                });
            } else {
                video.src = url;
                setTimeout(() => video.play(), 100);
            }
        } else {
            // If it's an iframe-based stream, show the iframe player
            frame.style.display = "block";
            frame.src = url + "&autoplay=true";
        }
    }

    /* ====================
       FULLSCREEN
       ==================== */
    function goFullScreen() {
        const v = document.getElementById("video");
        if (v.requestFullscreen) v.requestFullscreen();
    }

    /* ====================
       REMOTE KEYS
       ==================== */
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            channel = (channel + 1) % streams.length; // Next channel
            loadStream(channel);
            goFullScreen();
        }
        else if (e.key === "ArrowLeft") {
            channel = (channel - 1 + streams.length) % streams.length; // Previous channel
            loadStream(channel);
            goFullScreen();
        }
        else if (e.key === "Enter") {
            goFullScreen(); // Enter to fullscreen
        }
        else if (e.key === "Escape" || e.key === "Backspace") {
            window.location.href = "index.html"; // Navigate away on Escape or Backspace
        }
    });

    /* LOAD FIRST CHANNEL */
    loadStream(channel);
