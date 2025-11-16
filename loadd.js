 const streams = [
        "https://live.channel8.com/Channel8-Kurdish/index.m3u8",
        "https://live9.karwan.tv/Kurdsattvyusfstore/index.m3u8",
        "https://live.karwan.tv/kurdsat-news-tv/index.m3u8?token=b081e709a8d8a8ec1cf7d65bf9bb3ab90dd57115-eb2d2c54275d23d8bead04b9f06e97da-1763334490-1763323690&remote=no_check_ip",
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

    // Channel names corresponding to the above streams
    const channelNames = [
        "Channel 8", "Kurdsat HD", "Kurdsat News", "Gali Kurdistan", "Kirkuk HD",
        "Payam HD", "Shar TV", "Rudaw HD", "Speda HD", "Speda Drama",
        "K24 HD", "AVA Media", "NRT News", "NRT Sport", "Kurdmax TV", "Ranya City",
        "YouTube Sample"
    ];

    // DOM elements
    const video = document.getElementById("video");
    const frame = document.getElementById("frame");
    const channelNameBox = document.getElementById("channelName");
    const container = document.getElementById("container");

    // HLS object
    let hls;

    // Get channel ID from URL query parameter, default to 0
    let channel = parseInt(new URLSearchParams(window.location.search).get("channel")) || 0;

    // Show the channel name with animation
    function showChannelName(name) {
        channelNameBox.textContent = name;
        channelNameBox.style.opacity = 1;
        channelNameBox.style.transform = "translateX(-50%) scale(1.25)";

        setTimeout(() => {
            channelNameBox.style.opacity = 0;
            channelNameBox.style.transform = "translateX(-50%) scale(1)";
        }, 4000);
    }

    // Load the stream based on the channel ID
    function loadStream(id) {
        const url = streams[id];
        showChannelName(channelNames[id]);

        // Always stop the current video or iframe before loading a new one
        resetPlayer();

        // Check if it's a video stream (.m3u8)
        if (url.endsWith(".m3u8")) {
            loadVideoStream(url);
        } else {
            loadIframe(url);
        }
    }

    // Reset the video and iframe elements
    function resetPlayer() {
        if (hls) {
            hls.destroy();
            hls = null;
        }

        video.pause();
        video.removeAttribute("src");
        video.load();  // fully resets video element

        frame.src = "";  // fully resets iframe
    }

    // Load video stream (HLS)
    function loadVideoStream(url) {
        frame.style.display = "none";
        video.style.display = "block";

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
        } else {
            video.src = url;
            video.play();
        }
    }

    // Load iframe stream
    function loadIframe(url) {
        video.style.display = "none";
        frame.style.display = "block";
        frame.src = url;
    }

    // Fullscreen mode
    function goFullScreen() {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        }
    }

    // Keydown events for channel navigation and fullscreen toggle
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

    // Initial load of the first channel
    loadStream(channel);
