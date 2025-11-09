import Grid, { type GridOptions } from './Grid';
import type { Overlay } from '../bases/Overlay';
import type { OverlayCollection } from './OverlayCollection';
import { ROTATION, type Rotation, type Sprite } from './Sprite';
import type { TextureSheet } from './TileSheet';
import { Item } from '../bases/Item';
import { isPositionInBounds, type XY, type Location } from './Utils';
import type { HarvesterBuilding } from './buildings/HarvesterBuilding';
import { BuildableTile } from './tiles/BuildableTile';
import type { FarmlandTile } from './tiles/FarmlandTile';

export interface GameOptions {
  grid: GridOptions,
  container: string,
  menu: string,
  textures: TextureSheet,
  onComplete: Function
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
  #menu: HTMLDivElement
  #tempBuilding?: HarvesterBuilding
  #tempEventController: AbortController
  #onComplete: Function
  #ended: boolean

  constructor(options: GameOptions) {
    this.#canvas = this.#generateCanvas(options.container);
    this.#menu = document.querySelector(options.menu) as HTMLDivElement
    this.#c = this.#canvas.getContext("2d")!;
    this.#c.imageSmoothingEnabled = false;
    this.#scale = NaN;
    this.#listeners = []
    this.#tempEventController = new AbortController()
    this.#overlays = []
    this.#drawAsOverlays = []
    this.#items = []
    this.#textures = options.textures
    this.#onComplete = options.onComplete
    this.#lastMousePosition = { x: -1, y: -1 }
    this.#initListeners()

    this.#ended = false

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
    if (!this.#ended) window.requestAnimationFrame((t) => this.update(t));
  }
  on(type: GameEventType, pos: Location, cb: Function) {
    this.#listeners.push({
      type: type,
      position: pos,
      callback: cb
    })
  }
  off(type: GameEventType, pos: Location, cb: Function) {
    this.#listeners.splice(this.#listeners.findIndex(l =>
      l.type == type &&
      l.position == pos &&
      l.callback == cb
    ), 1)
  }
  end() {
    this.#canvas.remove()
    this.#ended = true
    this.#onComplete()
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
  openMenu(type: string, dataList: any, buildFunction: Function, tile: BuildableTile | FarmlandTile) {
    this.#closeMenu()
    this.#tempEventController = new AbortController()
    this.#menu.hidden = false
    if (tile.center.x < this.#grid.width * 0.5) {
      this.#menu.classList.add("right")
    } else {
      this.#menu.classList.remove("right")
    }
    const template = this.#menu.querySelector("#buildingMenuTemplate")

    let rotation: Rotation = { ...ROTATION.UP }

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "r":
          rotation.a = (rotation.a + 90) % 360
          break;
        case "R":
          rotation.a = (rotation.a - 90) % 360
          break;
        case "Escape":
          this.#closeMenu()
          break;
        default:
          break;
      }
      if (this.#tempBuilding) {
        this.#tempBuilding.setRotation(rotation)
      }
    }, { signal: this.#tempEventController.signal })

    Object.keys(dataList).forEach(b => {

      const item = template?.cloneNode(true) as HTMLDivElement
      item.hidden = false
      item.removeAttribute("id")
      item.classList.add("removable")

      const texturePosition = this.#textures.getTexture(b)

      item.style.setProperty("--image-position-x", (texturePosition[0] / this.#grid.tileSize).toString())
      item.style.setProperty("--image-position-y", (texturePosition[1] / this.#grid.tileSize).toString())

      const name = item.querySelector(".buildingName")!
      const desc = item.querySelector(".buildingDesc")!

      if (type == "build" && tile instanceof BuildableTile) {
        item.addEventListener("click", () => {
          buildFunction(b, rotation)
          this.#closeMenu()
        })
        item.addEventListener("mouseenter", () => {
          if (this.#tempBuilding) this.#tempBuilding.hideOverlay()
          this.#tempBuilding = tile.resolveBuilding(b, tile.x, tile.y, tile.width, rotation, this.#textures, this, this.#grid, false) // last false prevents temp building from creating events
        })
        item.addEventListener("mouseleave", () => {
          if (this.#tempBuilding) this.#tempBuilding.hideOverlay()
          this.#tempBuilding = undefined
        })
      } else if (type == "building") {
        const removeButton = this.#menu.querySelector("#cancelButton")?.cloneNode(true)! as HTMLDivElement
        removeButton.textContent = "REMOVE"
        removeButton.classList.add("removable")
        removeButton.addEventListener("click", () => {
          buildFunction()
          this.#closeMenu()
        })
        this.#menu.insertBefore(removeButton, this.#menu.lastElementChild)
      } else if (type == "plant") {
        item.addEventListener("click", () => {
          buildFunction(b)
          this.#closeMenu()
        })
      }

      name.textContent = dataList[b].title
      desc.textContent = dataList[b].desc

      this.#menu.insertBefore(item, this.#menu.firstChild)
    })
    this.#menu.querySelector("#cancelButton")?.addEventListener("click", () => this.#closeMenu(), { once: true })
  }
  #closeMenu() {
    this.#tempEventController.abort()
    this.#menu.hidden = true
    this.#menu.querySelectorAll(".removable").forEach(e => e.remove())
    if (this.#tempBuilding) this.#tempBuilding.hideOverlay()
    this.#tempBuilding = undefined
  }
}
