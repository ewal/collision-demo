import { Actor, CollisionType, Color, Engine, Input } from 'excalibur';
import { KeyEvent } from 'excalibur/build/dist/Input/Keyboard';
import InputState from '~src/utils/input-state';

enum DragFactor {
  WALK = 1 / 2000,
  RUN = 1 / 5000,
}

enum Facing {
  Left = -1,
  Nowhere = 0,
  Right = 1,
}

class BaseCharacter extends Actor {
  private readonly acceleration = 400;
  private readonly deceleration = 300;

  private facing: Facing = Facing.Nowhere;

  constructor() {
    super({
      width: 32,
      height: 32,
      collisionType: CollisionType.Active,
      color: Color.Cyan,
    });
  }

  override onInitialize(engine: Engine): void {
    this.body.useGravity = true;

    engine.input.keyboard.on('hold', this.handleHold);
    engine.input.keyboard.on('release', this.handleRelease);
  }

  private handleRelease = (_event: KeyEvent): void => {
    if (!InputState.getInstance().isHoldingDirKey) {
      this.facing = Facing.Nowhere;
    }
  };

  private handleHold = (event: KeyEvent): void => {
    if (event.key === Input.Keys.A) {
      this.facing = Facing.Left;
    }

    if (event.key === Input.Keys.D) {
      this.facing = Facing.Right;
    }
  };

  override onPreUpdate(_engine: Engine, delta: number): void {
    const deltaTime = delta * 0.001;

    // Acceleration
    if (
      this.facing !== Facing.Nowhere &&
      !InputState.getInstance().isHoldingDirKeys
    ) {
      this.vel.x += this.acceleration * deltaTime * this.facing;
    } else if (this.vel.x !== 0) {
      const decelFactor = Math.min(
        Math.abs(this.vel.x),
        this.deceleration * deltaTime
      );

      this.vel.x += this.vel.x > 0 ? -decelFactor : decelFactor;
    }

    // Drag
    const dragFactor = InputState.getInstance().isHoldingSprint
      ? DragFactor.RUN
      : DragFactor.WALK;
    const drag = dragFactor * this.vel.x * Math.abs(this.vel.x);
    this.vel.x -= drag;

    // Position
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;

    // "Jumping" (not really. Just moving up for demo purpose)
    if (InputState.getInstance().isHoldingJump) {
      this.vel.y = -(250 + Math.abs(this.vel.x) * 0.5);
    }
  }
}

export default BaseCharacter;
