import Grid, { type GridOptions } from './Grid';
import type { Overlay } from './bases/Overlay';
import type { OverlayCollection } from './OverlayCollection';
import { ROTATION, type Rotation, type Sprite } from './Sprite';
import type { TextureSheet } from './TileSheet';
import { Item } from './bases/Item';
import { isPositionInBounds, type XY, type Location, isRectInBounds } from './Utils';
import type { HarvesterBuilding } from './buildings/HarvesterBuilding';
import { BuildableTile } from './tiles/BuildableTile';
import type { FarmlandTile } from './tiles/FarmlandTile';
import type { WheatCrop } from './crops/WheatCrop';
import type { CornCrop } from './crops/CornCrop';
import type { PumpkinCrop } from './crops/PumpkinCrop';
import type { Controls } from './LevelController';

export type AnyCrop = typeof WheatCrop | typeof CornCrop | typeof PumpkinCrop

export interface GameOptions {
  grid: GridOptions,
  container: string,
  menu: string,
  textures: TextureSheet,
  onComplete: Function,
  controls: Controls
}
export interface GameEventListener {
  type: GameEventType,
  position: Location,
  callback: Function
}
export type ControlElements = {
    fastForward: HTMLInputElement
    play: HTMLInputElement
    pause: HTMLInputElement
}
export enum GameEventType {
  MOUSEOVER,
  CLICK,
  MOUSELEAVE,
  SELECT,
  DESELECT,
  HOVER,
  DEHOVER
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
  #tempBuildings?: HarvesterBuilding[]
  #tempEventController: AbortController
  #onComplete: Function
  #ended: boolean
  #mousePressed: boolean
  #onBuildListeners: GameEventListener[] | null = null
  #selectStart = { x: -1, y: -1 }
  #controls: ControlElements
  speed = 1

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
    this.#mousePressed = false
    this.#textures = options.textures
    this.#onComplete = options.onComplete
    this.#lastMousePosition = { x: -1, y: -1 }
    this.#controls = Object.fromEntries(Object.entries(options.controls).map(([k,v]) => [k, document.querySelector(v)])) as ControlElements
    this.#initListeners()

    this.#ended = false

    this.#grid = new Grid(options.grid, options.textures, this);

    this.#resizeCanvas();
  }
  #initListeners() {
    this.#canvas.addEventListener("mousemove", e => this.#handleMouseMove(e))
    this.#canvas.addEventListener("mousedown", e => this.#handleMouseMove(e))
    this.#canvas.addEventListener("mouseup", e => this.#handleMouseMove(e))
    this.#controls.fastForward.addEventListener("click", () => this.speed = 3)
    this.#controls.play.addEventListener("click", () => this.speed = 1)
    this.#controls.pause.addEventListener("click", () => this.speed = 0)
    this.#controls.play.checked = true
  }
  #handleMouseMove(e: MouseEvent) {
    const [canvasX, canvasY] = this.#toCanvasCoords(e.clientX, e.clientY)
    const [prevCanvasX, prevCanvasY] = this.#toCanvasCoords(this.#lastMousePosition.x, this.#lastMousePosition.y)


    const selectionBbox = {
      x: Math.min(this.#selectStart.x, canvasX),
      y: Math.min(this.#selectStart.y, canvasY),
      height: Math.abs(canvasY - this.#selectStart.y),
      width: Math.abs(canvasX - this.#selectStart.x)
    }

    if (this.#mousePressed != (e.buttons == 1)) {
      this.#mousePressed = e.buttons == 1
      this.#listeners.filter(l =>
        l.type == (this.#mousePressed ? GameEventType.DEHOVER : GameEventType.HOVER) &&
        isPositionInBounds(prevCanvasX, prevCanvasY, l.position)
      ).forEach(l => l.callback())
      this.#listeners.filter(l =>
        l.type == (this.#mousePressed ? GameEventType.DESELECT : GameEventType.SELECT) &&
        isPositionInBounds(prevCanvasX, prevCanvasY, l.position)
      ).forEach(l => l.callback())
      if (!this.#mousePressed) {
        this.#closeMenu()
        this.#listeners.filter(l =>
          l.type == GameEventType.CLICK &&
          isRectInBounds(l.position, selectionBbox)
        ).forEach(l => l.callback())
        this.#listeners.filter(l =>
          l.type == GameEventType.DESELECT &&
          isRectInBounds(l.position, selectionBbox)
        ).forEach(l => l.callback())
      }

    }
    if (!this.#mousePressed) this.#selectStart = { x: canvasX, y: canvasY }
    if (this.#mousePressed) {
      this.#listeners.filter(l =>
        l.type == GameEventType.DESELECT
      ).forEach(l => l.callback())
      this.#listeners.filter(l =>
        l.type == GameEventType.SELECT &&
        isRectInBounds(l.position, selectionBbox)
      ).forEach(l => l.callback())
    } else {
      this.#listeners.filter(l =>
        (l.type == GameEventType.DEHOVER || l.type == GameEventType.DESELECT) &&
        !isPositionInBounds(canvasX, canvasY, l.position) &&
        isPositionInBounds(prevCanvasX, prevCanvasY, l.position)
      ).forEach(l => l.callback())

      this.#listeners.filter(l =>
        (l.type == GameEventType.HOVER || l.type == GameEventType.SELECT) &&
        isPositionInBounds(canvasX, canvasY, l.position) &&
        !isPositionInBounds(prevCanvasX, prevCanvasY, l.position)
      ).forEach(l => l.callback())
    }
    this.#listeners.filter(l =>
      l.type == GameEventType.DEHOVER &&
      !isPositionInBounds(canvasX, canvasY, l.position) &&
      isPositionInBounds(prevCanvasX, prevCanvasY, l.position)
    ).forEach(l => l.callback())

    this.#listeners.filter(l =>
      l.type == GameEventType.HOVER &&
      isPositionInBounds(canvasX, canvasY, l.position) &&
      !isPositionInBounds(prevCanvasX, prevCanvasY, l.position)
    ).forEach(l => l.callback())

    this.#lastMousePosition = { x: e.clientX, y: e.clientY }
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

    if (this.#tempBuildings) {
      this.#tempBuildings.forEach(b => {
        this.drawAsOverlay(b)
        b.showOverlay()
      })
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
    this.speed = 0
    this.#onComplete()
    this.#ended = true
    this.#remove()
  }
  #remove() {
    this.#canvas.remove()
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
  addItem(x: number, y: number, type: string, creationTime: number, variations: string[] = []) {
    const item = new Item(x, y, this.#grid.tileSize, ROTATION.UP, this.#textures, type, creationTime, variations)
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
  openMenu(type: string, dataList: any, buildFunction: Function, tile: BuildableTile | FarmlandTile, closePrevious = true) {
    if (closePrevious) this.#closeMenu()
    if (this.#onBuildListeners !== null && closePrevious === false) this.#onBuildListeners.push({callback: buildFunction, position: tile.position, type: GameEventType.CLICK })
    else {
      this.#onBuildListeners = []
      this.#tempEventController = new AbortController()
      this.#menu.hidden = false
      if (tile.center.x < this.#grid.width * 0.3) {
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
        if (this.#tempBuildings) {
          this.#tempBuildings.forEach(b => b.setRotation(rotation))
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
            this.#onBuildListeners?.forEach(l => l.callback(b, rotation))
            buildFunction(b, rotation)
            this.#closeMenu()
          })
          item.addEventListener("mouseenter", () => {
            if (this.#tempBuildings) this.#tempBuildings.forEach(b => b.hideOverlay())
            this.#tempBuildings = [tile, ...(this.#onBuildListeners || [])].map(t => tile.resolveBuilding(b, t.position.x, t.position.y, t.position.width, rotation, this.#textures, this, this.#grid, false)) // last false prevents temp building from creating events
          })
          item.addEventListener("mouseleave", () => {
            if (this.#tempBuildings) this.#tempBuildings.forEach(b => b.hideOverlay())
            this.#tempBuildings = undefined
          })
        } else if (type == "building") {
          const removeButton = this.#menu.querySelector("#cancelButton")?.cloneNode(true)! as HTMLDivElement
          removeButton.textContent = "REMOVE"
          removeButton.classList.add("removable")
          removeButton.addEventListener("click", () => {
            buildFunction()
            this.#onBuildListeners?.forEach(l => l.callback())
            this.#closeMenu()
          })
          this.#menu.insertBefore(removeButton, this.#menu.lastElementChild)
        } else if (type == "plant") {
          item.addEventListener("click", () => {
            this.#onBuildListeners?.forEach(l => l.callback(b))
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
  }
  #closeMenu() {
    this.#tempEventController.abort()
    this.#onBuildListeners = null
    this.#menu.hidden = true
    this.#menu.querySelectorAll(".removable").forEach(e => e.remove())
    if (this.#tempBuildings) this.#tempBuildings.forEach(b => b.hideOverlay())
    this.#tempBuildings = []
  }
}
