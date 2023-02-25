import { DevTool } from '@excaliburjs/dev-tools';
import { Axis, DisplayMode, Engine, Loader, Physics, Vector } from 'excalibur';

import BaseCharacter from './characters/base_character';
import * as Levels from './levels';
import InputState from './utils/input-state';

export const GameConfig = {
  tileSize: 16,
};

Physics.useArcadePhysics();
Physics.enabled = true;
Physics.acc = new Vector(0, 1500);

class Game extends Engine {
  constructor() {
    super({
      displayMode: DisplayMode.FitScreen,
      width: 40 * GameConfig.tileSize,
      height: 30 * GameConfig.tileSize,
      antialiasing: false,
      snapToPixel: false,
      canvasElementId: 'game',
      suppressConsoleBootMessage: true,
      suppressPlayButton: true,
      fixedUpdateFps: 60,
    });
  }

  override onInitialize(): void {
    InputState.getInstance(this);
  }
}

const game = new Game();
const loader = new Loader();

game.showDebug(false);

game.start(loader).then(async () => {
  const scene = await Levels.Level2.build();
  game.addScene('startScene', scene);
  game.goToScene('startScene');

  const mainActor = new BaseCharacter();
  mainActor.pos = new Vector(game.halfDrawWidth, game.halfDrawHeight);
  scene.mainActor = mainActor;
  game.currentScene.add(mainActor);

  game.currentScene.camera.clearAllStrategies();
  game.currentScene.camera.strategy.lockToActorAxis(mainActor, Axis.X);
});

game.on('fallbackgraphicscontext', (ctx) => {
  console.log('fallback triggered', ctx);
});

const devtool = new DevTool(game);
console.log('devtool', devtool);

export { game };
