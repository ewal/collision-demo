import { TiledMap, TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Engine, Scene } from 'excalibur';

class BaseLevel extends Scene {
  declare mapResource?: TiledMapResource;
  declare mapTileset?: TiledMap;

  constructor(map: TiledMapResource) {
    super();
    this.mapResource = map;
  }

  public addMap(): void {
    if (this.mapResource) {
      this.mapResource.addTiledMapToScene(this.engine.currentScene);
    }
  }

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine);
    this.addMap();
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
