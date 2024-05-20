const fs = require('fs-extra');


clearCache = async() =>{
    cacheDir = process.env.CACHE_DIR;

    fs.emptyDir(cacheDir, err => {
        if (err) return console.error(err);
        console.log('Cache cleared!');
    });
}

module.exports = clearCache