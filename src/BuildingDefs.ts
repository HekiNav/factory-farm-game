import { ConveyorBuilding } from "./classes/buildings/ConveyorBuilding"
import { HarvesterBuilding } from "./classes/buildings/HarvesterBuilding"
import { MillBuilding } from "./classes/buildings/MillBuilding"
import { OvenBuilding } from "./classes/buildings/OvenBuilding"
import { SeparatorBuilding } from "./classes/buildings/SeparatorBuilding"
import { TrashcanBuilding } from "./classes/buildings/TrashcanBuilding"
import type { ObjectDetails } from "./CropTileDefs"

export const buildings = {
  "harvester": HarvesterBuilding,
  "conveyor": ConveyorBuilding,
  "trashcan": TrashcanBuilding,
  "separator": SeparatorBuilding,
  "oven": OvenBuilding,
  "mill": MillBuilding
}
export type AnyBuilding = HarvesterBuilding | ConveyorBuilding | TrashcanBuilding | SeparatorBuilding | OvenBuilding | MillBuilding
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
  },
  "separator": {
    title: "Separator",
    desc: "Separates items",
  },
  "mill": {
    title: "Mill",
    desc: "Grinds things, mostly grain. Destroys non-suitable items.",
  },
  "oven": {
    title: "Oven",
    desc: "Cooks delicious soup and bread",
  }
}
