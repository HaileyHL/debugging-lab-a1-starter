import Timer from "../../ReduxStore/containers/Timer";
import * as React from "react";
import { Stage, FastLayer, Layer } from "react-konva";

import { Point } from "../../utils/objectTypes";
import {
  COLORS,
  createHistogram,
  getDimensionForScoreBoard,
} from "../../utils/functions";
import ScoreBar from "./GameElements/ScoreBar";

/**
 * Props for ScoreBoard
 * - fieldColors: 2D array of field ownership used to compute scores
 * - dimension: logical board dimension used to compute layout
 * - mobile: flag indicating mobile/touch mode (affects layout)
 */
export interface Props {
  fieldColors: number[][];
  dimension: Point;
  mobile: number;
}

/**
 * ScoreBoard
 *
 * Renders a horizontal scoreboard that visualizes the distribution of field ownership
 * across players as adjacent colored bars and shows the Timer overlay.
 */
class ScoreBoard extends React.Component<Props, object> {
  /**
   * Compute pixel dimensions for the scoreboard, create ScoreBar elements from the
   * field histogram, and render them inside a Konva Stage.
   */
  render() {
    let canvDim = getDimensionForScoreBoard(
      this.props.dimension,
      this.props.mobile !== 0
    );
    const scoreBars = createScoreBars(this.props.fieldColors, canvDim);
    return (
      <div className="ScoreBoard">
        <Stage width={canvDim.X} height={canvDim.Y}>
          <FastLayer>{scoreBars}</FastLayer>

          <Layer>
            <Timer />
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default ScoreBoard;

// helpers

/**
 * Build ScoreBar components from a histogram of field ownership.
 * Returns an array of JSX ScoreBar elements positioned/sized by the layouter.
 */
function createScoreBars(fields: number[][], canvasDimension: Point) {
  var bars: JSX.Element[] = [];

  var colorsArr, valuesArr: number[];
  ({ colorsArr, valuesArr } = createHistogram(fields, false));

  colorsArr.forEach((value: number, index: number) => {
    bars.push(
      <ScoreBar
        color={COLORS[value]}
        rect={scoreBoardLayouter(valuesArr, index, canvasDimension)}
        key={COLORS[value]}
      />
    );
  });
  return bars;
}

/**
 * Compute the rectangle for a single score bar given value slices and canvas dimension.
 * The bar width is proportional to the value relative to the total.
 */
function scoreBoardLayouter(
  values: number[],
  position: number,
  dim: Point
): { X: number; Y: number; Width: number; Height: number } {
  const total = values.reduce((a, b) => a + b, 0);
  const x =
    position === 0 ? 0 : values.slice(0, position).reduce((a, b) => a + b, 0);

  return {
  X: Math.floor((dim.X * values[position]) / total),
  Y: 0,
  Width: Math.floor((dim.X * x) / total),
  Height: dim.Y
};
}
