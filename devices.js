const image = require('./image');
const waveshare4In2Driver = require('bindings')('waveshare4in2.node');
const waveshare7in5v2Driver = require('bindings')('waveshare7in5v2.node');
const waveshare3In7Driver = require('bindings')('waveshare3in7.node');
const waveshare2in13v2Driver = require('bindings')('waveshare2in13v2.node');
const waveshare2in13bcDriver = require('bindings')('waveshare2in13bc.node');
const waveshare2in7Driver = require('bindings')('waveshare2in7.node');
const waveshare2in7bDriver = require('bindings')('waveshare2in7b.node');
const waveshare2in7v2Driver = require('bindings')('waveshare2in7v2.node');
const waveshare2in7v2bDriver = require('bindings')('waveshare2in7bv2.node');

const defaultDevice = {
    height: 0, // number - height resolution of device
    width: 0, // number - width resolution of device
    rotated: false, // boolean - is device rotated 90 degrees
    rightToLeft: false, // boolean - does device buffer read right to left
    numColors: 2, // number - 2 (1bitBW) or 4 (4gray)
    driver: undefined, // binding
    displayPNG: async function (imgContents, dither) {
        const args = [imgContents, this.rotated, dither, this.rightToLeft];

        if (this.numColors === 4) {
            const buffer = await image.convertPNGto4Grey(...args);
            this.driver.display_4GrayDisplay(buffer);
        } else {
            const buffer = await image.convertPNGto1BitBW(...args);
            this.driver.display(buffer);
        }
    },
    init: function () {
        if (this.numColors === 4) {
            this.driver.init_4Gray();
        } else {
            this.driver.init();
        }
    },
};

const waveshare4in2Horizontal = {
    ...defaultDevice,
    height: 300,
    width: 400,
    rotated: false,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare4In2Driver,
};

const waveshare4in2Vertical = {
    ...defaultDevice,
    height: 400,
    width: 300,
    rotated: true,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare4In2Driver,
};

const waveshare4in2HorizontalGray = {
    ...defaultDevice,
    height: 300,
    width: 400,
    rotated: false,
    rightToLeft: false,
    numColors: 4,
    driver: waveshare4In2Driver,
};

const waveshare4in2VerticalGray = {
    ...defaultDevice,
    height: 400,
    width: 300,
    rotated: true,
    rightToLeft: false,
    numColors: 4,
    driver: waveshare4In2Driver,
};

const waveshare7in5v2Horizontal = {
    ...defaultDevice,
    height: 480,
    width: 800,
    rotated: false,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare7in5v2Driver,
};

const waveshare7in5v2Vertical = {
    ...defaultDevice,
    height: 800,
    width: 480,
    rotated: true,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare7in5v2Driver,
};

const waveshare3in7Vertical = {
    ...defaultDevice,
    height: 480,
    width: 280,
    rotated: false,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare3In7Driver,
};

const waveshare3in7Horizontal = {
    ...defaultDevice,
    height: 280,
    width: 480,
    rotated: true,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare3In7Driver,
};

const waveshare3in7VerticalGray = {
    ...defaultDevice,
    height: 480,
    width: 280,
    rotated: false,
    rightToLeft: false,
    numColors: 4,
    driver: waveshare3In7Driver,
};

const waveshare3in7HorizontalGray = {
    ...defaultDevice,
    height: 280,
    width: 480,
    rotated: true,
    rightToLeft: false,
    numColors: 4,
    driver: waveshare3In7Driver,
};

const waveshare2in13v2Vertical = {
    ...defaultDevice,
    height: 250,
    width: 122,
    rotated: false,
    rightToLeft: true,
    numColors: 2,
    driver: waveshare2in13v2Driver,
};

const waveshare2in13v2Horizontal = {
    ...defaultDevice,
    height: 122,
    width: 250,
    rotated: true,
    rightToLeft: true,
    numColors: 2,
    driver: waveshare2in13v2Driver,
};

const waveshare2in13bcHorizontal = {
    ...defaultDevice,
    height: 104,
    width: 212,
    rotated: true,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare2in13bcDriver,
};

const waveshare2in13bcVertical = {
    ...defaultDevice,
    height: 212,
    width: 104,
    rotated: false,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare2in13bcDriver,
};

const waveshare2in7v2Vertical = {
    ...defaultDevice,
    height: 176,
    width: 264,
    rotated: false,
    rightToLeft: true,
    numColors: 2,
    driver: waveshare2in7v2Driver,
};

const waveshare2in7Horizontal = {
    ...defaultDevice,
    height: 176,
    width: 264,
    rotated: true,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare2in7Driver,
};
const waveshare2in7Vertical = {
    ...defaultDevice,
    height: 264,
    width: 176,
    rotated: false,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare2in7Driver,
};

const waveshare2in7v2Horizontal = {
    ...defaultDevice,
    height: 264,
    width: 176,
    rotated: true,
    rightToLeft: true,
    numColors: 2,
    driver: waveshare2in7v2Driver,
};

const waveshare2in7bHorizontal = {
    ...defaultDevice,
    height: 264,
    width: 176,
    rotated: true,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare2in7bDriver,
};

const waveshare2in7bVertical = {
    ...defaultDevice,
    height: 176,
    width: 264,
    rotated: false,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare2in7bDriver,
};
const waveshare2in7V2bHorizontal = {
    ...defaultDevice,
    height: 264,
    width: 176,
    rotated: true,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare2in7v2bDriver,
};

const waveshare2in7V2bVertical = {
    ...defaultDevice,
    height: 176,
    width: 264,
    rotated: false,
    rightToLeft: false,
    numColors: 2,
    driver: waveshare2in7v2bDriver,
};

const devices = {
    // default waveshare4in2 kept for backwards compatibility with release 1.0.0
    waveshare4in2: waveshare4in2Horizontal,
    waveshare4in2Horizontal,
    waveshare4in2HorizontalGray,
    waveshare4in2Vertical,
    waveshare4in2VerticalGray,
    // default waveshare7in5v2 kept for backwards compatibility with releaes 1.1.0
    waveshare7in5v2: waveshare7in5v2Horizontal,
    waveshare7in5v2Horizontal,
    waveshare7in5v2Vertical,
    waveshare7in2v2Vertical: waveshare7in5v2Vertical, // backwards compatible typo
    // default
    waveshare3in7: waveshare3in7HorizontalGray,
    waveshare3in7Horizontal,
    waveshare3in7HorizontalGray,
    waveshare3in7Vertical,
    waveshare3in7VerticalGray,
    waveshare2in13v2: waveshare2in13v2Horizontal,
    waveshare2in13v2Horizontal,
    waveshare2in13v2Vertical,
    waveshare2in13bcHorizontal,
    waveshare2in13bcVertical,
    waveshare2in13bc: waveshare2in13bcHorizontal,
    waveshare2in7b: waveshare2in7bHorizontal,
    waveshare2in7bVertical,
    waveshare2in7v2: waveshare2in7v2Horizontal,
    waveshare2in7v2Vertical,
    waveshare2in7: waveshare2in7Horizontal,
    waveshare2in7Vertical,
    waveshare2in7V2b: waveshare2in7V2bHorizontal,
    waveshare2in7V2bVertical,
};

module.exports = devices;
