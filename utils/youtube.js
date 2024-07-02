const Song = require("../Models/Song").Song;
const axios = require("axios");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmetadata = require("ffmetadata");
const database = require("../Database/historydb");
const path = require("path");
const fs = require("fs");
const spotify = require("../utils/spotify");
require("dotenv").config();

async function getInfo(url) {
  const songInfo = await ytdl.getInfo(url); // usa ytdl per ottenere le informazioni della canzone
  const songNameOriginal = songInfo.videoDetails.title.replace(/\//g, "-"); 
  const artist = songInfo.videoDetails.author.name;

  const thumbnailsArray = songInfo.videoDetails.thumbnails;
  const thumbnail = thumbnailsArray.find(thumb => thumb.url.includes('maxres')) || thumbnailsArray[thumbnailsArray.length - 1] ; // filtra le thumbnail per prendere quella con qualità migliore
  const videoId = songInfo.videoDetails.videoId;
  const duration = songInfo.videoDetails.lengthSeconds;
  return new Song(videoId, url, thumbnail.url, songNameOriginal, artist, duration); // restituisce un oggetto Song con le informazioni della canzone 
}

async function searchSong(songName) {
  try {
    const response = await axios.get(process.env.YOUTUBE_API_BASE_URL, { // utilizza l'API di youtube per cercare la canzone
      params: {
        key: process.env.YOUTUBE_API_KEY,
        q: songName,
        part: "snippet",
        order: "relevance",
        maxResults: 10, // massimo 10 risultati (non sprecare token per richieste inutili)
      },
    });
    // crea un array di oggetti Song con videoId, link, thumbnail, title e artist
    var songsList = [];
    for (var i = 0; i < response.data.items.length; i++) {
      songsList.push(
        new Song(
          response.data.items[i].id.videoId, // videoId di youtube
          `https://www.youtube.com/watch?v=${response.data.items[i].id.videoId}`, // link alla canzone
          `https://i.ytimg.com/vi/${response.data.items[i].id.videoId}/hqdefault.jpg`, // thumbnail
          response.data.items[i].snippet.title, // titolo della canzone
          response.data.items[i].snippet.channelTitle // artista
        )
      );
    }
  } catch (error) {
    console.log(error.message);
  }
  return songsList;
}

// Scarica una canzone tramite il link di youtube
async function downloadSong(songLink, userSub, res) {
  try {
    downloadPath = process.env.CACHE_DIR;
    // cerchiamo se la cartella di cache esiste, altrimenti la crea
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    const song = await getInfo(songLink); // cerca le informazioni della canzone 
    database.addSongToHistoryByUserSub(song, userSub); // aggiunge la canzone alla cronologia

    const filePath = path.join(downloadPath, `${song.songId}.mp3`); // crea il percorso del file
    // se il file è già presente in cache, non lo scarica nuovamente e lo invia al client
    if (fs.existsSync(filePath)) {
      sendFile(song.title, filePath, res);
      return;
    }

    // scarica solo l'audio e alla massima qualità da youtube
    const stream = ytdl(songLink, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    // Settiamo i metadata che vogliamo inserire nel file per permettere la riproduzione su ogni dispositivo
    const metadata = {
      title: song.title,
      artist: song.artist,
    };

    ffmpeg(stream) //convertiamo la canzone tramite ffmpeg
      .audioBitrate(320) // settiamo il bitrate massimo per mp3
      .save(filePath) // settiamo dove salvare la canzone
      .outputOptions([
        "-metadata",
        `title=${metadata.title}`, // impostiamo il titolo nei metadata
        "-metadata",
        `artist=${metadata.artist}`, // importiamo l'artista nei metadata
      ])
      .on("end", () => {
        sendFile(song.title, filePath, res);
      })
      .on("error", (error) => {
        console.error(error);
        res.status(500).send("Errore durante la conversione in mp3");
      });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Errore durante il download della canzone");
    }
  }
}

// Invia il file al client
function sendFile(songName, filePath, res) {
  res.header("Access-Control-Expose-Headers", "*"); // permette di creare header personalizzati in express per mandare il nome della canzone
  res.set({
    "Content-Type": "audio/mpeg",
  });
  res.set("songName", `${encodeURIComponent(songName)}`); // impostiamo l'header per inviare il nome della canzone
  // inviamo il file al client
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      if (res.headersSent) {
      } else {
        return res.sendStatus(500);
      }
    }
  });
}


async function DownloadBySpotify(link, subUser, res) {
  try {
    songName = await spotify.getSongName(link);
    artistName = await spotify.getSongArtist(link);
    song = (
      await searchSong(songName + " " + artistName + " Official video")
    )[0];
    console.log("[INFO] Song: ", song);
    await downloadSong(song.link, subUser, res);
  } catch (error) {
    throw error;
  }
}


async function streamSong(songLink, res){
  try {
    downloadPath = process.env.CACHE_DIR;

    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    const song = await getInfo(songLink);

    res.header("Access-Control-Expose-Headers", "*");
    res.set({
      "Content-Type": "audio/mpeg", // contenuto di tipo audio
    });
    res.set("songName", `${encodeURIComponent(song.title) }`); // titolo della canzone tramite encodeUriComponent
    res.set("artist", `${encodeURIComponent(song.artist)}`); // autore della canzone tramite encodeUriComponent
    res.set("thumbnail", `${song.thumbnail}`); // copertina della canzone 
    const duration = encodeURIComponent(formatDuration(song.duration)); // durata della canzone tramite encodeUriComponent, formattato in mm:ss
    res.set("duration", `${duration}`);



    const filePath = path.join(downloadPath, `${song.songId}.mp3`);
    if (fs.existsSync(filePath)) {
      sendFile(song.title, filePath, res);
      return;
    }

    const stream = ytdl(songLink, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    const metadata = {
      title: song.title,
      artist: song.artist,
    };

    ffmpeg(stream)
      .audioBitrate(320)
      .save(filePath)
      .outputOptions([
        "-metadata",
        `title=${metadata.title}`,
        "-metadata",
        `artist=${metadata.artist}`,
      ])
      .on("end", () => {
        sendFile(song.title, filePath, res);
      })
      .on("error", (error) => {
        console.error(error);
        res.status(500).send("Errore durante la conversione in mp3");
      });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Errore durante lo streaming della canzone");
    }
  }

}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

module.exports = {
  searchSong,
  downloadSong,
  getInfo,
  DownloadBySpotify,
  streamSong,
};
