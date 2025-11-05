import Grid, { type GridOptions } from './Grid';
import type { Location } from './Sprite';
import type { TextureSheet } from './TileSheet';

export interface GameOptions {
  grid: GridOptions,
  container: string,
  textures: TextureSheet
}
export interface GameEventListener {
  type: GameEventType,
  position: Location,
  callback: Function
}
export enum GameEventType {
  MOUSEOVER,
  CLICK,
  MOUSELEAVE,
}
export class Game {
  #grid: Grid;
  #canvas: HTMLCanvasElement;
  #c: CanvasRenderingContext2D;
  #scale: number;
  #listeners: Array<GameEventListener>
  constructor(options: GameOptions, tiles: Record<string, any>) {
    this.#canvas = this.#generateCanvas(options.container);
    this.#c = this.#canvas.getContext("2d")!;
    this.#c.imageSmoothingEnabled = false;
    this.#scale = NaN;
    this.#listeners = []
    this.#initListeners()

    this.#grid = new Grid(options.grid, tiles, options.textures, this);

    this.#resizeCanvas();
  }
  #initListeners() {
    this.#canvas.addEventListener("mousemove", e => this.#handleMouseMove(e))
    this.#canvas.addEventListener("click", e => this.#handleClick(e))
  }
  #handleMouseMove(_e: MouseEvent) {

  }
  #handleClick(e: MouseEvent) {
    const [canvasX, canvasY] = this.#toCanvasCoords(e.clientX, e.clientY)
    this.#listeners.filter(l => 
      l.type == GameEventType.CLICK && 
      canvasX >= l.position.x &&
      canvasX < l.position.x + l.position.width &&
      canvasY >= l.position.y &&
      canvasY < l.position.y + l.position.height
    ).forEach(l => l.callback())
  }
  #toCanvasCoords(xPos: number, yPos: number) {
    const { y, x } = this.#canvas.getBoundingClientRect()
    return [xPos - x, yPos - y].map(n => Math.floor(n / this.#scale))
  }
  #generateCanvas(selector: string) {
    const canvas = document.createElement("canvas");
    document.querySelector(selector)?.append(canvas);
    return canvas;
  }
  #getScale() {
    const gridRatio = this.#grid.aspectRatio;
    const screenRatio = window.innerWidth / window.innerHeight;
    return Math.floor(gridRatio > screenRatio ? window.innerWidth / this.#grid.width : window.innerHeight / this.#grid.height);
  }
  #resizeCanvas(): boolean {
    if (this.#scale == this.#getScale()) return false;
    this.#scale = this.#getScale();
    this.#canvas.width = this.#scale * this.#grid.width;
    this.#canvas.height = this.#scale * this.#grid.height;
    this.#c.imageSmoothingEnabled = false;
    return true;
  }
  update(time: number) {
    this.#c.clearRect(0, 0, this.#grid.width * this.#scale, this.#grid.height * this.#scale);
    this.#resizeCanvas();
    this.#grid.update(this.#c, this.#scale, time);
    window.requestAnimationFrame((t) => this.update(t));
  }
  on(type: GameEventType, pos: Location, cb: Function) {
    this.#listeners.push({
      type: type,
      position: pos,
      callback: cb
    })
  }
}
