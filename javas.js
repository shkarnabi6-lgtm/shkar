 const streams = [
        
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
