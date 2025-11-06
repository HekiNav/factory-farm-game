import Grid, { type GridOptions } from './Grid';
import type { Overlay } from './Overlay';
import type { OverlayCollection } from './OverlayCollection';
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
  #overlays: Array<OverlayCollection | Overlay>
  #lastMousePosition: Record<string, number>
  constructor(options: GameOptions) {
    this.#canvas = this.#generateCanvas(options.container);
    this.#c = this.#canvas.getContext("2d")!;
    this.#c.imageSmoothingEnabled = false;
    this.#scale = NaN;
    this.#listeners = []
    this.#overlays = []
    this.#lastMousePosition = {x: -1, y: -1}
    this.#initListeners()

    this.#grid = new Grid(options.grid, options.textures, this);

    this.#resizeCanvas();
  }
  #initListeners() {
    this.#canvas.addEventListener("mousemove", e => this.#handleMouseMove(e))
    this.#canvas.addEventListener("click", e => this.#handleClick(e))
  }
  #handleMouseMove(e: MouseEvent) {
    const [canvasX, canvasY] = this.#toCanvasCoords(e.clientX, e.clientY)
    const [prevCanvasX, prevCanvasY] = this.#toCanvasCoords(this.#lastMousePosition.x,this.#lastMousePosition.y)

    this.#listeners.filter(l =>
      l.type == GameEventType.MOUSEOVER &&
      positionInBounds(canvasX, canvasY, l.position) &&
      !positionInBounds(prevCanvasX, prevCanvasY, l.position)
    ).forEach(l => l.callback())

    this.#listeners.filter(l =>
      l.type == GameEventType.MOUSELEAVE &&
      !positionInBounds(canvasX, canvasY, l.position) &&
      positionInBounds(prevCanvasX, prevCanvasY, l.position)
    ).forEach(l => l.callback())

    this.#lastMousePosition = { x: e.clientX, y: e.clientY }
  }
  #handleClick(e: MouseEvent) {
    const [canvasX, canvasY] = this.#toCanvasCoords(e.clientX, e.clientY)
    this.#listeners.filter(l =>
      l.type == GameEventType.CLICK &&
      positionInBounds(canvasX, canvasY, l.position)
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

    this.#overlays.forEach(o => o.draw(this.#c, this.#scale))

    window.requestAnimationFrame((t) => this.update(t));
  }
  on(type: GameEventType, pos: Location, cb: Function) {
    this.#listeners.push({
      type: type,
      position: pos,
      callback: cb
    })
  }
  addOverlay(overlay: OverlayCollection | Overlay) {
    this.#overlays.push(overlay)
    return overlay.id
  }
  removeOverlay(overlayId: string) {
    console.log(this.#overlays, overlayId)
    this.#overlays = this.#overlays.filter(o => o.id != overlayId)
  }
}
function positionInBounds(x: number, y: number, bounds: Location) {
  return x >= bounds.x &&
    x < bounds.x + bounds.width &&
    y >= bounds.y &&
    y < bounds.y + bounds.height
}
