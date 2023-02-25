import { TiledMap, TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Engine, Scene } from 'excalibur';
import BaseCharacter from '~src/characters/base_character';

export enum CollisionObject {
  OneWay = 'OneWay',
}

class BaseLevel extends Scene {
  declare mainActor?: BaseCharacter;
  declare mapResource?: TiledMapResource;
  declare mapTileset?: TiledMap;

  constructor(map: TiledMapResource) {
    super();
    this.mapResource = map;
  }

  public async addMap(): Promise<void> {
    if (this.mapResource) {
      this.mapResource.addTiledMapToScene(this.engine.currentScene);
    }
  }

  override async onInitialize(engine: Engine): Promise<void> {
    super.onInitialize(engine);
    await this.addMap();
  }

  static async build(mapResource: TiledMapResource): Promise<BaseLevel> {
    const level = new this(mapResource);

    if (!level.mapResource?.isLoaded()) {
      await level.loadMap();
    }

    return level;
  }

  private async loadMap(): Promise<void> {
    const tiledMap = await this.mapResource?.load();
    this.mapTileset = tiledMap;
  }
}

export default BaseLevel;
