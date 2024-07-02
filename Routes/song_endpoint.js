const express = require("express")
const router = express.Router()

const youtube = require('../utils/youtube');

// Ricerca tramite nome della canzone passato come parametro
router.get('/searchByName/:songName', (req, res) => {
    const songName = req.params.songName + " original song";
    youtube.searchSong(songName).then((songs) => {
        res.send(songs);
    }).catch((error) => {
        console.log(error);
        res.status(500).send("Error");
    });
});

// Rimuove il parametro tempo dal link di youtube
function removeParamT(url) {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('t');
    return urlObj.toString();
}

// Scarica una canzone con il link di spotify o youtube
router.post("/downloadSongByLink", (req, res) => {
    const songLink = req.body.songLink;
    const userSub = req.body.userSub;
    // Regex per verificare se i link sono di spotify o youtube
    const spotifyRegex =/^https:\/\/open\.spotify\.com(\/intl-[a-z]{2})?\/track\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9_-]{16,32}$/;
    const intlSpotifyRegex = /\/intl-[a-z]{2}/; // per rimuovere la parte internazionale dal link fornito dalla piattaforma web di spotify
    const youtubeRegex = /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|playlist\?list=)|youtu\.be\/)([\w-]+)(?:[&?][\w-]+=[\w-]+)*$/;
    
    try{
        if (songLink.match(spotifyRegex)) {
            spotLink = songLink.replace(intlSpotifyRegex, '');
            youtube.DownloadBySpotify(spotLink,userSub ,res).then(() => {}).catch((error) => {
                console.log(error);
                res.status(500).send("Internal Server Error");
            });
        }
        else if(songLink.match(youtubeRegex)){
            let link = removeParamT(songLink) // indica il minutaggio a partire dal quale scaricare la canzone
            youtube.downloadSong(link,userSub ,res).then(() => {
            }).catch((error) => {
                console.log(error);
                res.status(500).send("Internal Server Error");
            });
        }else{
            throw new Error('Invalid link');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error");
    }
});

// Stream di una canzone
router.get("/streamSong/:songLink", (req, res) => {
    try{
        const songLink = req.params.songLink; // Il link all'interno del parametro usa la codifica uri 
        // decode url songLink 
        const link = decodeURIComponent(songLink);
        youtube.streamSong(link, res);
    }catch(error){
        console.log(error);
        res.status(500).send("Error");
    }
    
});


module.exports = router;