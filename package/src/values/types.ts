export interface SkiaReadonlyValue<T = number> {
  /**
   * Gets the value hold by the Value object
   */
  readonly current: T;
  /**
   * Adds a listener that is called when value changes.
   * Returns unsubscribe method.
   */
  addListener: (cb: (value: T) => void) => () => void;
  /**
   * Field to make typechecking easier
   */
  __typename__: "RNSkValue";
}

export interface SkiaValue<T = number> extends SkiaReadonlyValue<T> {
  /**
   * Get/sets the value hold by the Value object
   */
  current: T;
  /**
   * Get/sets the animation controlling the value
   * */
  animation: SkiaAnimation | undefined;
}

export interface SkiaClockValue extends SkiaReadonlyValue<number> {
  start: () => void;
  stop: () => void;
}

export interface SkiaAnimation extends SkiaClockValue {
  cancel: () => void;
}

export interface AnimationState {
  current: number;
  finished: boolean;
}

export interface ISkiaValueApi {
  /**
   * Creates a new value that holds the initial value and that
   * can be changed.
   */
  createValue: <T>(initialValue: T) => SkiaValue<T>;
  /**
   * Creates a derived value. This is a calculated value that returns the result of
   * a function that is called with the values of the dependencies.
   */
  createDerivedValue: <R>(
    cb: () => R,
    values: Array<SkiaReadonlyValue<unknown>>
  ) => SkiaReadonlyValue<R>;
  /**
   * Creates a clock value where the value is the number of milliseconds elapsed
   * since the clock was created
   */
  createClockValue: () => SkiaClockValue;
  /**
   * Creates an animation that is driven from a clock and updated every frame.
   * @param cb Callback to calculate next value from time.
   * @returns An animation object that can control a value.
   */
  createAnimation: <S extends AnimationState = AnimationState>(
    cb: (t: number, state: S | undefined) => S
  ) => SkiaAnimation;
}
