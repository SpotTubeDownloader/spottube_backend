const express = require("express")
const router = express.Router()

const youtube = require('../utils/youtube');

router.get('/searchByName/:songName', (req, res) => {
    const songName = req.params.songName + " original song";
    youtube.searchSong(songName).then((songs) => {
        res.send(songs);
    }).catch((error) => {
        console.log(error);
        res.status(500).send("Error");
    });
});


router.post("/downloadSongByLink", (req, res) => {
    const songLink = req.body.songLink;
    const userSub = req.body.userSub;

    const spotifyRegex =/^https:\/\/open\.spotify\.com(\/intl-[a-z]{2})?\/track\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9_-]{16,32}$/;
    const intlSpotifyRegex = /\/intl-[a-z]{2}/;
    const youtubeRegex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+$/;
    try{
        if (songLink.match(spotifyRegex)) {
            spotLink = songLink.replace(intlSpotifyRegex, '');
            youtube.DownloadBySpotify(spotLink,userSub ,res).then(() => {}).catch((error) => {
                console.log(error);
            });
        }
        else if(songLink.match(youtubeRegex)){
            youtube.downloadSong(songLink,userSub ,res).then(() => {
            }).catch((error) => {
                console.log(error);
            });
        }else{
            throw new Error('Invalid link');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error");
    }
});

router.get("/streamSong/:songLink", (req, res) => {
    try{
        const songLink = req.params.songLink;
        // decode url songLink 
        const link = decodeURIComponent(songLink);
        console.log("[StreamSong]: ",songLink);
        youtube.streamSong(songLink, res);
    }catch(error){
        console.log(error);
        res.status(500).send("Error");
    }
    
});


module.exports = router;