const fs = require('fs-extra');

// Funzione che pulisce la cache
clearCache = async() =>{
    cacheDir = process.env.CACHE_DIR;

    fs.emptyDir(cacheDir, err => {
        if (err) return console.error(err);
        console.log('Cache cleared!');
    });
}

module.exports = clearCache