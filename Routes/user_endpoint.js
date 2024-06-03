const express = require("express")
const userRouter = express.Router()
const database = require('../Database/database');
const userSong = require('../Models/UserSong');
//const { searchSong, downloadSong, getInfo } = require('../utils/youtube');
const youtube = require('../utils/youtube');

userRouter.post('/searchName', (req, res) => {
    const songName = req.body.songName + " original song";
    youtube.searchSong(songName).then((songs) => {
        res.send(songs);
    });
});
userRouter.post("/downloadSongBySongName", (req, res) => {
    const songLink = req.body.songLink;
    const subUser = req.body.sub;

    const spotifyRegex = /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9]{16}$/;
    const youtubeRegex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+$/;
    try{
        if (songLink.match(spotifyRegex)) {
            youtube.DownloadBySpotify(songLink,subUser ,res).then(() => {}).catch((error) => {
                console.log(error);
            });
        }
        else if(songLink.match(youtubeRegex)){
            youtube.downloadSong(songLink,subUser ,res).then(() => {
            }).catch((error) => {
                console.log(error);
            });
        }else{
            throw new Error('Invalid link');
        }
    } catch (error) {
        console.log(error.message);
        res.send("Invalid link");
    }
});

userRouter.post("/downloadVideoByLink", (req, res) => {
    const videoLink = req.body.videoLink;
    const subUser = req.body.sub;

    const spotifyRegex = /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9]{16}$/;
    const youtubeRegex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+$/;
    try{
        if (videoLink.match(spotifyRegex)) {
            youtube.DownloadBySpotify(videoLink,subUser ,res).then(() => {}).catch((error) => {
                console.log(error);
            });
        }
        else if(videoLink.match(youtubeRegex)){
            youtube.downloadSong(videoLink,subUser ,res).then(() => {
            }).catch((error) => {
                console.log(error);
            });
        }else{
            throw new Error('Invalid link');
        }
    } catch (error) {
        console.log(error.message);
        res.send("Invalid link");
    }
});

userRouter.get("/history/:sub", (req,res)=>{
    const subUser = req.params.sub;
    database.getHistory(subUser).then((history)=>{
        res.send(history);
    }).catch((error)=>{
        console.log(error);
    });
})


userRouter.post("/history/deleteElementinHistoryBySongId", (req,res)=>{
    const songId = req.body.songId;
    const subUser = req.body.subUser;
    console.log("[Database Delete]: ",songId);
    console.log("[Database Delete]: ",subUser);

    database.deleteElementinHistoryBySongId(songId,subUser).then((data)=>{
        database.getHistory(subUser).then((history)=>{
            res.send(history);
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });
});

userRouter.get("/favorites/:sub", (req,res)=>{
    const subUser = req.params.sub;
    database.getFavorites(subUser).then((favorites)=>{
        res.send(favorites);
    }).catch((error)=>{
        console.log(error);
    });
})

userRouter.post("/favorites/addFavorite", (req,res)=>{
    const videoLink = req.body.videoLink;
    const subUser = req.body.sub;

    getInfo(videoLink).then((song)=>{
        const favorite = new userSong(song, subUser)
        database.addFavorite(favorite).then(()=>{
            database.getFavorites(subUser).then((favorites)=>{
                res.send(favorites);
            }).catch((error)=>{
                console.log(error);
            });
        }).catch((error)=>{
            console.log(error);
        });
    }
    )
});

userRouter.post("/favorites/deleteFavorite", (req,res)=>{
    const songId = req.body.songId;
    const subUser = req.body.subUser;

    database.deleteFavoriteBySongId(songId,subUser).then(()=>{
        console.log("Favorite deleted");
        database.getFavorites(subUser).then((favorites)=>{
            console.log("Favorites: ",favorites);
            res.send(favorites);
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });
});

module.exports = userRouter;





userRouter.post("/formSp", async (req, res) => {
    //Get the song's link of the request
    const link = req.body.link;
    // const songName = await getSongName(link);
    getAccessToken();
    try {
      var linkType = recognzieSpotifyLink(link);
    } catch (error) {
      console.log(error.message);
      res.redirect("/formSp");
    }
    //Download by song's link

      const songName = await getSongName(link);
      const songArtist = await getSongArtist(link);
      var songToSearch = songName + " " + songArtist + " original video";
      const songLink = await searchSingleSong(songToSearch);
      const songNameOriginal = (
        await ytdl.getInfo(songLink)
      ).videoDetails.title.replace(/\//g, "-");
      console.log(`SongNameOriginal: ${songNameOriginal}`);
      console.log(`Link YT: ${songLink}`);
      res.setHeader(
        "Content-disposition",
        "attachment; filename=" + songNameOriginal + ".mp3"
      );
      res.setHeader("Content-type", "application/octet-stream");
      res.attachment(songNameOriginal + ".mp3");
  
      const stream = ytdl(songLink, {
        filter: "audioonly",
        quality: "highestaudio",
      });
      const outputFilePathDown = __dirname + "/" + songNameOriginal + ".mp3";
      console.log(outputFilePathDown);
      ffmpeg(stream)
        .audioCodec("libmp3lame")
        .format("mp3")
        .output(outputFilePathDown)
        .on("end", () => {
          const metadata = {
            title: songNameOriginal,
            artist: songArtist,
          };
          console.log("Download and conversion completed!");
          ffmetadata.write(outputFilePathDown, metadata, function (err) {
            if (err) {
              console.error("Error updating metadata:", err);
            } else {
              console.log("Metadata updated successfully!");
            }
          });
          setTimeout(() => {
            res.download(outputFilePathDown);
          }, 1500);
        })
        .on("error", (err) => console.error(err))
        .save(outputFilePathDown);
      // setTimeout(() => {
      //     deleteFile(outputFilePathDown);
      //     console.log('File deleted');
      // }, 5000);
      res.on("finish", () => {
        deleteFile(outputFilePathDown);
        console.log("File deleted");
      });
  });