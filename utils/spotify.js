const axios = require ("axios");
require('dotenv').config();



//Spotify API
const clientId =  process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
        });
        const accessToken = response.data.access_token;
        return accessToken;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// prendiamo il nome della canzone da spotify
async function getSongName(link) {
    try{
        let songId = link.split('/')[4];
        songId = songId.split('?')[0];
        const accessToken = await getAccessToken();
        console.log("[INFO]: Access Token ",accessToken);   
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const songName = response.data.name;
        console.log(songName);
        return songName;
    } catch (error) {
        throw error;
    }
};


async function getSongArtist(link) {
    try {
        const accessToken = await getAccessToken();
        let songId = link.split('/')[4];
        songId = songId.split('?')[0];

        const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const artistName = response.data.artists[0].name;
        console.log(artistName);
        return artistName;   
    } catch (error) {
        throw error;
    }
}

module.exports = { getSongName, getSongArtist };


