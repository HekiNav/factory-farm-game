import Grid, { type GridOptions } from './Grid';
import type { TextureSheet } from './TileSheet';

export interface GameOptions {
  grid: GridOptions,
  container: string,
  textures: TextureSheet
}
export class Game {
  grid: Grid;
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;
  scale: number;
  constructor(options: GameOptions, tiles: Record<string, any>) {
    this.grid = new Grid(options.grid, tiles, options.textures);
    this.canvas = this.#generateCanvas(options.container);
    this.c = this.canvas.getContext("2d")!;
    this.c.imageSmoothingEnabled = false;
    this.scale = NaN;
    this.#resizeCanvas();
  }
  #generateCanvas(selector: string) {
    const canvas = document.createElement("canvas");
    document.querySelector(selector)?.append(canvas);
    return canvas;
  }
  #getScale() {
    const gridRatio = this.grid.aspectRatio;
    const screenRatio = window.innerWidth / window.innerHeight;
    return (gridRatio > screenRatio ? window.innerWidth / this.grid.width : window.innerHeight / this.grid.height);
  }
  #resizeCanvas(): boolean {
    if (this.scale == this.#getScale()) return false;
    this.scale = this.#getScale();
    this.canvas.width = this.scale * this.grid.width;
    this.canvas.height = this.scale * this.grid.height;
    this.c.imageSmoothingEnabled = false;
    return true;
  }
  update() {
    this.c.clearRect(0, 0, this.grid.width * this.scale, this.grid.height * this.scale);
    this.#resizeCanvas();
    this.grid.update(this.c, this.scale);
    window.requestAnimationFrame(() => this.update());
  }
}
