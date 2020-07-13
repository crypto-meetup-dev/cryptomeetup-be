// Dependencies
const fs = require('fs')
const path = require('path')
const Jimp = require("jimp")
const axios = require('axios')
const PNG = require('pngjs').PNG

// Local Packages
const Log = require('./log')
const Global = require('./global')

/**
 * Get Rounded Avatar
 * @param {*} id            - User ID
 * @param {*} avatar        - Avatar link
 */
let getCircleAvatar = async (id, avatar) => {
    Log.debug("Processing avatar...")
    let imgCacheDir = path.resolve("./data/cache")
    let imgServeDir = path.resolve("./data/img")
    if (!fs.existsSync(imgCacheDir)) {
        fs.mkdirSync(imgCacheDir)
    }
    if (!fs.existsSync(imgServeDir)) {
        fs.mkdirSync(imgServeDir)
    }

    let avatarUrl = Global.Read('config').MTTKIMGCDN + avatar
    let extName = avatarUrl.replace(/(https?:\/\/)(.*\/)/gui, "").split(".")[1]
    Log.debug(avatarUrl)
    axios({
        method: 'get',
        url: avatarUrl,
        responseType: 'stream'
    }).then((response) => {
        Log.debug("Processing avatar... 30%")
        Log.debug('./data/cache/' + id + "." + extName)
        let writer = fs.createWriteStream('./data/cache/' + id + "." + extName)
        let original = './data/cache/' + id + "." + extName
        let output = './data/img/' + id + ".png"

        response.data.pipe(writer)
        writer.on('close', () => {
            Log.debug("Processing avatar... 50%")
            Jimp.read(original, function (err, image) {
                if (err) {
                    console.log(err)
                } else {
                    image.write(output)
                    Log.debug("Processing avatar... 70%")
                    fs.createReadStream(output)
                        .pipe(new PNG({
                            filterType: 4
                        }))
                        .on('parsed', function () {
                            Log.debug("Processing avatar... 80%")
                            for (var y = 0; y < this.height; y++) {
                                for (var x = 0; x < this.width; x++) {
                                    var idx = (this.width * y + x) << 2;
                                    var radius = this.height / 2;
                                    if (y >= Math.sqrt(Math.pow(radius, 2) - Math.pow(x - radius, 2)) + radius || y <= -(Math.sqrt(Math.pow(radius, 2) - Math.pow(x - radius, 2))) + radius) {
                                        this.data[idx + 3] = 0;
                                    }
                                }
                            }
                            Log.debug("Processing avatar... 90%")
                            this.pack().pipe(fs.createWriteStream(output));
                        });
                }
            })
        })


    }).catch(e => console.log(e))
}

module.exports = getCircleAvatar