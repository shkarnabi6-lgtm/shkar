const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
    // لینکی ئەو کەناڵەی کە لە عێراق بلۆکە
    const targetUrl = "http://dksip.com/466025200562/eu3mcuQj5M/168667";

    const options = {
        headers: {
            'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18'
        }
    };

    // ناردنی داواکاری بۆ سێرڤەری سەرەکی لە ڕێگەی پڕۆکسییەوە
    const request = https.get(targetUrl, options, (response) => {
        res.writeHead(response.statusCode, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'video/mp2t'
        });
        response.pipe(res); // ڕەوانەکردنی ڕاستەوخۆی داتای ڤیدیۆکە بۆ ئەپەکەت
    });

    request.on('error', (e) => {
        res.end(e.message);
    });
});

server.listen(process.env.PORT || 3000);
