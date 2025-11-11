import TouchScreen from "../../ReduxStore/containers/TouchScreen";
import Message from "../../ReduxStore/containers/Message";
import Tails from "../../ReduxStore/containers/Tails";
import * as React from "react";
import { Stage } from "react-konva";

import { Point } from "../../utils/objectTypes";
import Players from "../../ReduxStore/containers/Players";
import Fieldsx from "../../ReduxStore/containers/Fields";
import { getDimensionForGameBoard } from "../../utils/functions";

/**
 * Props for GameBoard
 * - dim: logical board dimensions
 * - gameState: current game state string used to decide overlays
 * - touchscreen: whether touchscreen controls are enabled (non-zero)
 * - tick: current game tick (unused here but passed through props)
 */
export interface Props {
  dim: Point;
  gameState: string;
  touchscreen: number;
  tick: number;
}

/**
 * GameBoard component
 *
 * Responsible for laying out the Konva Stage that contains the game layers (fields, tails, players)
 * and for conditionally rendering overlays such as the message and touchscreen controls.
 */
class GameBoard extends React.Component<Props, object> {
  // Cached pixel dimensions for the Konva stage computed from logical board size and UI mode.
  canvDim: Point = { X: 0, Y: 0 };

  /**
   * Render the main Stage and core layers. Computes the canvas dimensions each render
   * so the Stage always matches the expected layout for the current device/mode.
   */
  render() {
    this.canvDim = getDimensionForGameBoard(
      this.props.dim,
      this.props.touchscreen !== 0
    );

    return (
      <div>
        <Stage width={this.canvDim.X} height={this.canvDim.Y}>
          <Fieldsx />

          <Tails />

          <Players />

          {this.renderMessage()}

          {this.renderTouchScreen()}
        </Stage>
      </div>
    );
  }

  /**
   * Conditionally render the central Message overlay when the game is paused, initializing,
   * or finished. Keeps decision logic separated from render() for readability.
   */
  renderMessage() {
    if (
      this.props.gameState === "endGame" ||
      this.props.gameState === "paused" ||
      this.props.gameState === "initializing"
    ) {
      return <Message />;
    }
    return null;
  }

  /**
   * Conditionally render touchscreen controls when touchscreen mode is enabled.
   * Extracted as a method to keep the JSX in render() concise.
   */
  renderTouchScreen() {
    if (this.props.touchscreen !== 0) {
      return <TouchScreen />;
    }
    return null;
  }
}

export default GameBoard;
