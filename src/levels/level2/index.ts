import { Actor, CollisionType, Color, Engine, vec } from 'excalibur';
import Maps from 'src/resources/maps';
import BaseLevel from '../base_level';

class Level2 extends BaseLevel {
  public static async build(): Promise<Level2> {
    return await super.build(Maps.map_1_2);
  }

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine);
    const actorWithBoxCollider = new Actor({
      pos: vec(150, engine.drawHeight - 100),
      width: 100,
      height: 10,
      color: Color.Yellow,
      collisionType: CollisionType.Fixed,
    });

    this.add(actorWithBoxCollider);
  }
}

export default Level2;
