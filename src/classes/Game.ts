import Grid, { type GridOptions } from './Grid';
import type { Overlay } from '../bases/Overlay';
import type { OverlayCollection } from './OverlayCollection';
import { ROTATION, type Rotation, type Sprite } from './Sprite';
import type { TextureSheet } from './TileSheet';
import { Item } from '../bases/Item';
import { isPositionInBounds, type XY, type Location } from './Utils';
import { buildings } from '../main';
import type { HarvesterBuilding } from './buildings/HarvesterBuilding';
import type { BuildableTile } from './tiles/BuildableTile';

export interface GameOptions {
  grid: GridOptions,
  container: string,
  buildMenu: string,
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
  MOUSELEAVE
}
export class Game {
  #grid: Grid;
  #canvas: HTMLCanvasElement;
  #c: CanvasRenderingContext2D;
  #scale: number;
  #listeners: Array<GameEventListener>
  #items: Array<Item>
  #overlays: Array<OverlayCollection | Overlay>
  #lastMousePosition: XY
  #textures: TextureSheet
  #drawAsOverlays: Array<Sprite>
  #buildMenu: HTMLDivElement
  #tempBuilding?: HarvesterBuilding
  #tempEventController: AbortController

  constructor(options: GameOptions) {
    this.#canvas = this.#generateCanvas(options.container);
    this.#buildMenu = document.querySelector(options.buildMenu) as HTMLDivElement
    this.#c = this.#canvas.getContext("2d")!;
    this.#c.imageSmoothingEnabled = false;
    this.#scale = NaN;
    this.#listeners = []
    this.#tempEventController = new AbortController()
    this.#overlays = []
    this.#drawAsOverlays = []
    this.#items = []
    this.#textures = options.textures
    this.#lastMousePosition = { x: -1, y: -1 }
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
    const [prevCanvasX, prevCanvasY] = this.#toCanvasCoords(this.#lastMousePosition.x, this.#lastMousePosition.y)

    this.#listeners.filter(l =>
      l.type == GameEventType.MOUSELEAVE &&
      !isPositionInBounds(canvasX, canvasY, l.position) &&
      isPositionInBounds(prevCanvasX, prevCanvasY, l.position)
    ).forEach(l => l.callback())

    this.#listeners.filter(l =>
      l.type == GameEventType.MOUSEOVER &&
      isPositionInBounds(canvasX, canvasY, l.position) &&
      !isPositionInBounds(prevCanvasX, prevCanvasY, l.position)
    ).forEach(l => l.callback())

    this.#lastMousePosition = { x: e.clientX, y: e.clientY }
  }
  #handleClick(e: MouseEvent) {
    const [canvasX, canvasY] = this.#toCanvasCoords(e.clientX, e.clientY)
    this.#listeners.filter(l =>
      l.type == GameEventType.CLICK &&
      isPositionInBounds(canvasX, canvasY, l.position)
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

    this.#items.forEach(i => i.draw(this.#c, this.#scale))

    this.#drawAsOverlays.forEach(s => s.draw(this.#c, this.#scale))
    this.#drawAsOverlays = []

    this.#overlays.forEach(o => o.draw(this.#c, this.#scale))

    if (this.#tempBuilding) {
      this.drawAsOverlay(this.#tempBuilding)
      if (this.#tempBuilding) this.#tempBuilding.showOverlay()
    }
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
    this.#overlays.splice(this.#overlays.findIndex(o => o.id == overlayId), 1)
  }
  drawAsOverlay(sprite: Sprite) {
    this.#drawAsOverlays.push(sprite)
  }
  addItem(x: number, y: number, type: string, creationTime: number) {
    const item = new Item(x, y, this.#grid.tileSize, ROTATION.UP, this.#textures, type, creationTime)
    item.remove = () => this.removeItem(item.id)
    this.#items.push(item)
    return item
  }
  removeItem(itemId: string) {
    this.#items = this.#items.filter(o => o.id != itemId)
  }
  collidingItems(pos: Location): Array<Item> {
    return this.#items.filter(i => isPositionInBounds(i.center.x, i.center.y, pos))
  }
  openBuildMenu(buildFunction: Function, tile: BuildableTile) {
    this.#closeBuildMenu()
    this.#tempEventController = new AbortController()
    this.#buildMenu.hidden = false
    const template = this.#buildMenu.querySelector("#buildingMenuTemplate")

    let rotation: Rotation = { ...ROTATION.UP }

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "r":
          rotation.a = (rotation.a + 90) % 360
          break;
        case "R":
          rotation.a = (rotation.a - 90) % 360
          break;
        default:
          break;
      }
      if (this.#tempBuilding) {
        this.#tempBuilding.setRotation(rotation)
      }
    }, { signal: this.#tempEventController.signal })

    Object.keys(buildings).forEach(b => {

      const item = template?.cloneNode(true) as HTMLDivElement
      item.hidden = false
      item.removeAttribute("id")
      item.classList.add("removable")

      const texturePosition = this.#textures.getTexture(b)

      item.style.setProperty("--image-position-x", (texturePosition[0] / this.#grid.tileSize).toString())
      item.style.setProperty("--image-position-y", (texturePosition[1] / this.#grid.tileSize).toString())

      const name = item.querySelector(".buildingName")!

      item.addEventListener("click", () => {
        buildFunction(b, rotation)
        this.#closeBuildMenu()
      })
      item.addEventListener("mouseenter", () => {
        if (this.#tempBuilding) this.#tempBuilding.hideOverlay()
        this.#tempBuilding = tile.resolveBuilding(b, tile.x, tile.y, tile.width, rotation, this.#textures, this, this.#grid, false) // last false prevents temp building from creating events
      })
      item.addEventListener("mouseleave", () => {
        if (this.#tempBuilding) this.#tempBuilding.hideOverlay()
        this.#tempBuilding = undefined
      })

      name.textContent = b

      this.#buildMenu.insertBefore(item, this.#buildMenu.firstChild)
    })
    this.#buildMenu.querySelector("#cancelButton")?.addEventListener("click", () => this.#closeBuildMenu(), { once: true })
  }
  #closeBuildMenu() {
    this.#tempEventController.abort()
    this.#buildMenu.hidden = true
    this.#buildMenu.querySelectorAll(".removable").forEach(e => e.remove())
    if (this.#tempBuilding) this.#tempBuilding.hideOverlay()
    this.#tempBuilding = undefined
    console.log(this.#overlays)
  }
}
