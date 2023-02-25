import { Engine, Input } from 'excalibur';
import { KeyEvent } from 'excalibur/build/dist/Input/Keyboard';

export const DIR_KEYS = new Set([Input.Keys.A, Input.Keys.D]);
export const ACTION_KEYS = new Set([...DIR_KEYS, Input.Keys.O, Input.Keys.P]);

export default class InputState {
  private static instance: InputState;

  private declare keyMap: Map<Input.Keys, (state: boolean | undefined) => void>;
  private declare keyStates: Map<Input.Keys, boolean | undefined>;

  private constructor(public engine: Engine) {
    this.keyMap = new Map();
    this.keyStates = new Map();

    engine.input.keyboard.on('hold', this.handleHold);
    engine.input.keyboard.on('release', this.handleRelease);
  }

  public static getInstance(engine?: Engine): InputState {
    if (!InputState.instance) {
      if (!engine) {
        throw new Error('Engine is not defined');
      }

      InputState.instance = new InputState(engine);
    }

    return InputState.instance;
  }

  public get isHoldingJump(): boolean | undefined {
    return this.keyStates.get(Input.Keys.P);
  }

  public get isHoldingSprint(): boolean | undefined {
    return this.keyStates.get(Input.Keys.O);
  }

  public get isHoldingDirKey(): boolean | undefined {
    return this.isHoldingLeftDirKey || this.isHoldingRightDirKey;
  }

  public get isHoldingDirKeys(): boolean | undefined {
    return this.isHoldingLeftDirKey && this.isHoldingRightDirKey;
  }

  public get isHoldingLeftDirKey(): boolean | undefined {
    return this.keyStates.get(Input.Keys.A);
  }

  public get isHoldingRightDirKey(): boolean | undefined {
    return this.keyStates.get(Input.Keys.D);
  }

  private handleHold = (event: KeyEvent): void => {
    if (ACTION_KEYS.has(event.key)) {
      this.handleKey(event.key, true);
    }
  };

  private handleRelease = (event: KeyEvent): void => {
    this.handleKey(event.key, false);
  };

  private handleKey = (key: Input.Keys, state: boolean): void => {
    if (this.keyStates.get(key) === state) {
      return;
    }

    this.keyStates.set(key, state);
  };
}
