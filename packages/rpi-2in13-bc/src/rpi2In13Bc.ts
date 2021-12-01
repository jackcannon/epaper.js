import { ColorMode, DisplayDevice, Orientation, convertPNGto1BitBWRotated, convertPNGto1BitBW } from '@epaperjs/core';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi2In13BC implements DisplayDevice {
    public colorMode = ColorMode.Black;
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;
    private readonly converter: (img: Buffer) => Promise<Buffer>;

    constructor(public readonly orientation: Orientation = Orientation.Horizontal) {
        this.driver = bindings('waveshare2in13bc.node');
        this.height = orientation === Orientation.Horizontal ? 104 : 212;
        this.width = orientation === Orientation.Horizontal ? 212 : 104;
        this.converter = orientation === Orientation.Horizontal ? convertPNGto1BitBWRotated : convertPNGto1BitBW;
    }

    public init() {
        this.driver.dev_init();
        this.wake();
    }

    public wake() {
        this.driver.init();
    }

    public clear() {
        this.driver.clear();
    }

    public sleep() {
        this.driver.sleep();
    }

    public async displayPng(img: Buffer) {
        const blackBuffer = await this.converter(img);
        const emptyBuffer = Buffer.alloc(blackBuffer.length, 0xff);
        this.driver.display(blackBuffer, emptyBuffer);
    }
}