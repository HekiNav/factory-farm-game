import { ColorTile } from './classes/tiles/ColorTile'
import { EmptyTile } from './classes/tiles/EmptyTile'
import { FarmlandTile } from './classes/tiles/FarmlandTile'
import { TextureSheet } from './classes/TileSheet'
import './style.css'
import { TextureTile } from './classes/tiles/TextureTile'
import { BuildableTile } from './classes/tiles/BuildableTile'
import { HarvesterBuilding } from './classes/buildings/HarvesterBuilding'
import { WheatCrop } from './classes/crops/WheatCrop'
import { ConveyorBuilding } from './classes/buildings/ConveyorBuilding'
import { TrashcanBuilding } from './classes/buildings/TrashcanBuilding'
import { CornCrop } from './classes/crops/CornCrop'
import { DestinationTile } from './classes/tiles/DestinationTile'
import { LevelController } from './classes/LevelController'
import type { GridData } from './classes/Grid'

const BASE_URL = import.meta.env.BASE_URL

export const tiles = {
  "empty": EmptyTile,
  "color": ColorTile,
  "farmland": FarmlandTile,
  "texture": TextureTile,
  "buildable": BuildableTile,
  "destination": DestinationTile
}
export const crops = {
  "wheat": WheatCrop,
  "corn": CornCrop
}
export interface ObjectDetails {
  title: string,
  desc: string
}
export const cropData: Record<string, ObjectDetails> = {
  "wheat": {
    title: "Wheat",
    desc: "Grows a bit faster than corn but the grains need separating",
  },
  "corn": {
    title: "Corn",
    desc: "Its corn",
  }
}
export const buildings = {
  "harvester": HarvesterBuilding,
  "conveyor": ConveyorBuilding,
  "trashcan": TrashcanBuilding
}
export const buildingData: Record<string, ObjectDetails> = {
  "harvester": {
    title: "Harvester",
    desc: "Collects crops from a 3x3 area",
  },
  "conveyor": {
    title: "Conveyor belt",
    desc: "Moves items around",
  },
  "trashcan": {
    title: "Trash can",
    desc: "Discards anything you throw at it",
  }
}


async function getLevel(name: string) {
  return await getJson(BASE_URL + "levels/" + name + ".json")
}
async function getJson(url: string) {
  return await (await fetch(url)).json()
}

Promise.all([getJson(BASE_URL + "sprites/index.json"), getLevel("level1"), getLevel("level2")]).then(([tileData, ...levels]) => {
  const textureImage = new Image()
  textureImage.src = "/sprites/tiles.png"
  console.log("LOADING TEXTURES")
  textureImage.addEventListener("load", () => {
    console.log("LOADED TEXTURES")

    const tileSize = 16

    const textureSheet = new TextureSheet(textureImage, tileData, tileSize)

    new LevelController(textureSheet, "#buildMenu", "#game", tileSize, "#overlay", ...levels as GridData[])
  })

})
