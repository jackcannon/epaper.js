const PNGReader = require('png.js');

// https://www.w3.org/TR/AERT/#color-contrast
const getLuma = ([r, g, b, a]) => r * 0.299 + g * 0.587 + b * 0.114;
const allocBuffer = (w, h, perByte) =>
    Buffer.alloc(Math.ceil(w / perByte) * h, 0x00);

// rounds to the nearest acceptable luminance
// 2 = 0, 255
// 4 = 0, 85, 170, 255
const getNearest = (luma, numCols = 2) => {
    const breaks = numCols - 1;
    return Math.round((breaks * luma) / 255) * (255 / breaks);
};
// Returns bit-length of a given number e.g. 2 = 1, 4 = 2, 16 = 4
const getNumBits = (numCols) => Math.ceil(Math.log(numCols) / Math.log(2));
const getBitCrop = (numCols) => 0xff ^ (0xff >> getNumBits(numCols));
const toUnshiftedBit = (num, numCols = 2) => {
    return num & getBitCrop(numCols);
};

function convertPNG(
    pngBytes,
    numColors = 2,
    rotated = false,
    rightToLeft = false, // used for 2in13V2
    dither = false
) {
    const reader = new PNGReader(pngBytes);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const devHeight = rotated ? width : height;
            const devWidth = rotated ? height : width;

            const bitLength = getNumBits(numColors);
            const perByte = 8 / bitLength; // how many individual values per byte

            const outBuffer = allocBuffer(devWidth, devHeight, perByte);

            // store of quantization errors (for dithering)
            const quants =
                dither &&
                new Array(width).fill(1).map(() => new Array(height).fill(0));
            const storeQuantErr = (x, y, v) => {
                if (x < 0 || x >= width || y >= height) return;
                quants[x][y] += v;
            };

            // used for rightToLeft
            const lineWidth =
                devWidth % 8 === 0
                    ? Math.floor(devWidth / 8)
                    : Math.floor(devWidth / 8) + 1;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    // const x = rotated ? ver : hor;
                    // const y = rotated ? hor : ver;

                    let outX = rotated ? y : x;
                    let outY = rotated ? devHeight - x - 1 : y;

                    if (rightToLeft) {
                        outX = rotated ? y : devWidth - x;
                        outY = rotated
                            ? devHeight - (devHeight - x - 1) - 1
                            : y;
                    }

                    const luma = getLuma(png.getPixel(x, y));
                    let nearest = getNearest(luma);

                    if (dither) {
                        const dithered = luma + quants[x][y];
                        nearest = getNearest(dithered);
                        const qu_err = dithered - nearest;

                        storeQuantErr(x + 1, y, (qu_err * 7) / 16);
                        storeQuantErr(x - 1, y + 1, (qu_err * 3) / 16);
                        storeQuantErr(x, y + 1, (qu_err * 5) / 16);
                        storeQuantErr(x + 1, y + 1, (qu_err * 1) / 16);
                    }

                    const buffIndex = rightToLeft
                        ? Math.floor(outX / perByte) + y * lineWidth
                        : Math.floor((outX + outY * devWidth) / perByte);

                    outBuffer[buffIndex] |=
                        toUnshiftedBit(nearest, numColors) >>
                        (Math.floor(outX % perByte) * bitLength);
                }
            }
            resolve(outBuffer);
        });
    });
}

module.exports = {
    convertPNG,
};
