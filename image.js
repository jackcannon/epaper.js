const PNGReader = require('png.js');
const sharp = require('sharp');

// https://www.w3.org/TR/AERT/#color-contrast
const getLuma = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114;
const allocBuffer_8 = (devWidth, devHeight) =>
    Buffer.alloc(Math.ceil(devWidth / 8) * devHeight, 0xff);
const allocBuffer_4 = (devWidth, devHeight) =>
    Buffer.alloc(Math.ceil(devWidth / 4) * devHeight, 0xff);

function convertPNGto1BitBW(
    pngBytes,
    rotated = false,
    dither = false,
    rightToLeft = false // used for 2in13V2
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
            const outBuffer = allocBuffer_8(devWidth, devHeight);

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
                    let outX = rotated ? y : x;
                    let outY = rotated ? devHeight - x - 1 : y;

                    if (rightToLeft) {
                        outX = rotated ? y : devWidth - x;
                        outY = rotated
                            ? devHeight - (devHeight - x - 1) - 1
                            : y;
                    }

                    const [r, g, b] = png.getPixel(x, y);
                    let luma = getLuma(r, g, b);

                    if (dither) {
                        const oldValue = luma + quants[x][y];
                        const value = Math.round(oldValue / 255) * 255;
                        const qu_err = oldValue - value;

                        storeQuantErr(x + 1, y, (qu_err * 7) / 16);
                        storeQuantErr(x - 1, y + 1, (qu_err * 3) / 16);
                        storeQuantErr(x, y + 1, (qu_err * 5) / 16);
                        storeQuantErr(x + 1, y + 1, (qu_err * 1) / 16);

                        luma = value;
                    }

                    if (luma < 50) {
                        const out_index = rightToLeft
                            ? Math.floor(outX / 8) + y * lineWidth
                            : Math.floor((outX + outY * devWidth) / 8);
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(outX % 8));
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

async function convertPNGto4Grey(pngBytes, rotated = false) {
    const pngBytes_L = await sharp(pngBytes).greyscale().png().toBuffer();
    const reader = new PNGReader(pngBytes_L);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const devHeight = rotated ? width : height;
            const devWidth = rotated ? height : width;
            const outBuffer = allocBuffer_4(devWidth, devHeight);
            let i = 0;
            for (let a = 0; a < devHeight; a++) {
                for (let b = 0; b < devWidth; b++) {
                    const x = rotated ? a : b;
                    const y = rotated ? b : a;

                    const outX = rotated ? y : x;
                    const outY = rotated ? devHeight - x - 1 : y;
                    if (++i % 4 == 0) {
                        const out_index = Math.floor(
                            (outX + outY * devWidth) / 4
                        );
                        const pixel = (diff) =>
                            rotated
                                ? png.getPixel(x, y - diff)
                                : png.getPixel(x - diff, y);
                        outBuffer[out_index] =
                            (getGrayPixel(pixel(3)) & 0xc0) |
                            ((getGrayPixel(pixel(2)) & 0xc0) >> 2) |
                            ((getGrayPixel(pixel(1)) & 0xc0) >> 4) |
                            ((getGrayPixel(pixel(0)) & 0xc0) >> 6);
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

function getGrayPixel(rgba) {
    // In a grayscale image: r, g, b are all set to the same value and a == 255
    let [pixel] = rgba;
    if (pixel === 0xc0) {
        pixel = 0x80;
    } else if (pixel === 0x80) {
        pixel = 0x40;
    }
    return pixel;
}

module.exports = {
    convertPNGto1BitBW,
    convertPNGto4Grey,
};
