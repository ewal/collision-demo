import Maps from 'src/resources/maps';
import BaseLevel from '../base_level';

class Level2 extends BaseLevel {
  public static async build(): Promise<Level2> {
    return await super.build(Maps.map_1_2);
  }
}

export default Level2;
