import { ColorTile } from './classes/tiles/ColorTile'
import { EmptyTile } from './classes/tiles/EmptyTile'
import { FarmlandTile } from './classes/tiles/FarmlandTile'
import { TextureSheet } from './classes/TileSheet'
import { Game } from './classes/Game'
import './style.css'
import { TextureTile } from './classes/tiles/TextureTile'
import { BuildableTile } from './classes/tiles/BuildableTile'
import { HarvesterBuilding } from './classes/buildings/HarvesterBuilding'
import { WheatCrop } from './classes/crops/WheatCrop'
import { ConveyorBuilding } from './classes/buildings/ConveyorBuilding'
import { TrashcanBuilding } from './classes/buildings/TrashcanBuilding'

const BASE_URL = import.meta.env.BASE_URL

export const tiles = {
  "empty": EmptyTile,
  "color": ColorTile,
  "farmland": FarmlandTile,
  "texture": TextureTile,
  "buildable": BuildableTile
}
export const crops = {
  "wheat": WheatCrop
}
export interface ObjectDetails {
  title: string,
  desc: string
}
export const cropData: Record<string, ObjectDetails> = {
  "wheat": {
    title:"Wheat",
    desc:"Grows quickly",
  }
}
export const buildings = {
  "harvester": HarvesterBuilding,
  "conveyor": ConveyorBuilding,
  "trashcan": TrashcanBuilding
}
export const buildingData: Record<string, ObjectDetails> = {
  "harvester": {
    title:"Harvester",
    desc:"Collects crops from a 3x3 area",
  },
  "conveyor": {
    title:"Conveyor belt",
    desc:"Moves items around",
  },
  "trashcan": {
    title:"Trash can",
    desc:"Discards anything you throw at it",
  }
}


async function getLevel(name: string) {
  return await getJson(BASE_URL + "levels/" + name + ".json")
}
async function getJson(url: string) {
  return await (await fetch(url)).json()
}

Promise.all([getLevel("test"), getJson(BASE_URL + "sprites/index.json")]).then(([levelData, tileData]) => {
  const textureImage = new Image()
  textureImage.src = "/sprites/tiles.png"
  console.log("LOADING TEXTURES")
  textureImage.addEventListener("load", () => {
    console.log("LOADED TEXTURES")

    const tileSize = 16

    const textureSheet = new TextureSheet(textureImage, tileData, tileSize)

    const game = new Game({
      grid: {
        data: levelData,
        tileSize: tileSize
      },
      container: "#game",
      menu: "#buildMenu",
      textures: textureSheet
    })
    game.update(0)
  })

})
