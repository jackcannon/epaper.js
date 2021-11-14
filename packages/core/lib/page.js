"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPage = exports.Page = void 0;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
class Page {
    constructor(browserPage) {
        this.browserPage = browserPage;
    }
    async display(url) {
        await this.browserPage.goto(url, {
            waitUntil: 'networkidle2',
        });
        return await this.browserPage.screenshot({
            type: 'png',
            fullPage: false,
            encoding: 'binary',
        });
    }
    onConsoleLog(callback) {
        this.browserPage.on('console', (msg) => callback(msg.text()));
    }
}
exports.Page = Page;
async function getPage(width, height) {
    const browser = await puppeteer_core_1.default.launch({
        executablePath: 'chromium-browser',
        args: ['--font-render-hinting=slight'],
    });
    const browserPage = await browser.newPage();
    await browserPage.setViewport({
        width,
        height,
        deviceScaleFactor: 1,
    });
    return new Page(browserPage);
}
exports.getPage = getPage;
