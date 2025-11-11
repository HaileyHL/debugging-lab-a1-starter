import * as React from "react";
import * as actions from "../../ReduxStore/actionTypes";
import * as ReactKonva from "react-konva";
import { Point } from "../../utils/objectTypes";
import { Stage } from "konva";
import { shiftDirectionLeft, shiftDirectionRight } from "../../AI/AiFunctions";

export interface Props {
  tick: number;
  mode: number;
  playerCoords: Point;
  nextDirection: string;
  dim: Point;
  phase: string;
  onPlayerModify: (value: string) => actions.ChangeDirection;
  onRestart: () => actions.CreateBoard;
  onResume: () => actions.Resume;
}
/**
 * TouchScreen
 *
 * Handles touch-driven input modes for directing the player. Supports multiple
 * interaction modes (relative, absolute, following) and exposes small UI helpers
 * rendered on a Konva layer to indicate control regions. The component drives
 * player direction updates by calling the provided `onPlayerModify` callback.
 */
class TouchScreen extends React.Component<Props> {
  stage: Stage = undefined as any;
  directing: boolean = false;
  tapped: boolean = false;
  myRef: any | null = null;

  constructor(props: Props) {
    super(props);
  }

  /**
   * Setup: capture the stage reference, size the interaction rect, and attach
   * touchstart/touchend listeners to control whether we're currently directing.
   */
  componentDidMount() {
    let rect: any = this.refs.rect;
    this.stage = rect.getStage();

    rect.width(this.stage.width());
    rect.height(this.stage.height());

    rect.on("touchstart", () => {
      this.directing = true;
      this.playAgain();
    });
    rect.on("touchend", () => {
      this.directing = false;
    });

    this.forceUpdate();
  }

  /**
   * If the game is ended/paused/initializing, trigger the appropriate resume/restart action.
   */
  playAgain() {
    if (this.props.phase === "endGame") {
      this.props.onRestart();
    }

    if (this.props.phase === "paused") {
      this.props.onResume();
    }

    if (this.props.phase === "initializing") {
      this.props.onResume();
    }
  }

  /**
   * When new props arrive, if the user is currently touching the screen continue
   * directing the player; otherwise reset the tapped state.
   */
  componentWillReceiveProps() {
    if (this.directing) {
      this.directPlayer();
    } else {
      this.tapped = false;
    }
  }

  /**
   * Only re-render when the input mode changes. Otherwise we rely on Konva layer
   * updates and callbacks to update visuals and game state.
   */
  shouldComponentUpdate(nextProps: Props) {
    if (this.props.mode === nextProps.mode) {
      return false;
    }
    return true;
  }

  /**
   * Render the Konva helpers and an invisible Rect used to capture touch events.
   */
  render() {
    return (
      <ReactKonva.Layer>
        {this.renderTouchHelpers()}
        <ReactKonva.Rect ref={(el) => (this.myRef = el)} />
      </ReactKonva.Layer>
    );
  }

  /**
   * Choose which helper visuals to render based on the current control mode.
   */
  renderTouchHelpers() {
    if (this.stage === undefined) {
      return null;
    }

    if (this.props.mode === 1) {
      return this.renderLineHelper();
    } else if (this.props.mode === 2) {
      return this.renderArrowHelpers();
    }

    return null;
  }

  /**
   * Visual helper for relative mode: a vertical guideline dividing left/right.
   */
  renderLineHelper() {
    return (
      <ReactKonva.Line
        stroke={"black"}
        opacity={0.2}
        points={[
          this.stage.width() / 2,
          this.stage.height() / 4,
          this.stage.width() / 2,
          (this.stage.height() / 4) * 3,
        ]}
      />
    );
  }

  /**
   * Visual helpers for absolute/arrow mode: draw four small arrows around center.
   */
  renderArrowHelpers() {
    return (
      <ReactKonva.Group>
        <ReactKonva.Circle
          radius={1}
          stroke={"black"}
          opacity={0.2}
          x={this.stage.width() / 2}
          y={this.stage.height() / 2}
        />
        <ReactKonva.Arrow
          points={[0, 0, 20, 0]}
          stroke={"black"}
          opacity={0.2}
          x={this.stage.width() / 2}
          y={this.stage.height() / 2}
          fill={"black"}
        />
        <ReactKonva.Arrow
          points={[0, 0, 0, 20]}
          stroke={"black"}
          opacity={0.2}
          x={this.stage.width() / 2}
          y={this.stage.height() / 2}
          fill={"black"}
        />
        <ReactKonva.Arrow
          points={[0, 0, -20, 0]}
          stroke={"black"}
          opacity={0.2}
          x={this.stage.width() / 2}
          y={this.stage.height() / 2}
          fill={"black"}
        />
        <ReactKonva.Arrow
          points={[0, 0, 0, -20]}
          stroke={"black"}
          opacity={0.2}
          x={this.stage.width() / 2}
          y={this.stage.height() / 2}
          fill={"black"}
        />
      </ReactKonva.Group>
    );
  }

  /**
   * Compute a direction from the current touch pointer and notify the parent
   * if it differs from the queued `nextDirection`.
   */
  directPlayer() {
    let dir = this.calculateDirectionForTouch(this.props.mode);

    if (dir !== this.props.nextDirection) {
      this.props.onPlayerModify(dir);
    }
  }

  /**
   * Dispatch to the appropriate direction calculation strategy based on mode.
   */
  calculateDirectionForTouch(mode: number): string {
    let pointerCoords = this.stage.getPointerPosition();
    if (pointerCoords === undefined) {
      return this.props.nextDirection;
    }

    switch (mode) {
      case 1:
        return this.calculateDirectionRelativeMode(pointerCoords);
      case 2:
        return this.calculateDirectionAbsoluteMode(pointerCoords);
      case 3:
        return this.calculateDirectionFollowingMode(pointerCoords);
      default:
        return this.props.nextDirection;
    }
  }

  /**
   * Relative mode: a single tap shifts the current direction left/right depending
   * on which half of the screen was touched. Subsequent immediate taps are
   * ignored until the touch is released.
   */
  calculateDirectionRelativeMode(pointerCoords: { x: number; y: number }) {
    if (!this.tapped) {
      this.tapped = true;

      let dir = this.props.nextDirection;
      if (dir === "none") {
        dir = "up";
      }

      if (pointerCoords.x < this.stage.width() / 2) {
        return shiftDirectionLeft(dir);
      } else {
        return shiftDirectionRight(dir);
      }
    } else {
      return this.props.nextDirection;
    }
  }

  /**
   * Absolute mode: compute which quadrant (up/right/left/down) the touch lies in
   * relative to screen center and return the corresponding direction.
   */
  calculateDirectionAbsoluteMode(pointerCoords: { x: number; y: number }) {
    let dir = "none";
    let x = this.stage.width() / 2 - pointerCoords.x;
    let y = this.stage.height() / 2 - pointerCoords.y;

    if (x < y) {
      if (y > -x) {
        dir = "up";
      } else {
        dir = "right";
      }
    } else {
      if (y > -x) {
        dir = "left";
      } else {
        dir = "down";
      }
    }

    return dir;
  }

  /**
   * Following mode: compute direction based on the vector from touch point to
   * the player position (touch-to-player), returning the primary cardinal direction.
   */
  calculateDirectionFollowingMode(pointerCoords: { x: number; y: number }) {
    let pX =
      (this.props.playerCoords.X / this.props.dim.X) * this.stage.width();
    let pY =
      (this.props.playerCoords.Y / this.props.dim.Y) * this.stage.height();

    let dir = "none";
    let x = pX - pointerCoords.x;
    let y = pY - pointerCoords.y;

    if (x < y) {
      if (y > -x) {
        dir = "up";
      } else {
        dir = "right";
      }
    } else {
      if (y > -x) {
        dir = "left";
      } else {
        dir = "down";
      }
    }

    return dir;
  }
}

export default TouchScreen;
