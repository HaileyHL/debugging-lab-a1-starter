import { FastLayer } from "react-konva";
import * as React from "react";

import { Point } from "../../utils/objectTypes";
import { COLORS, layouter, PointsAreEqual } from "../../utils/functions";
import { getAllCoords } from "../../ReduxStore/reducers/GameLogic/CreateWorld";
import { Stage } from "konva";

/**
 * Props for the Fields component.
 */
export interface Props {
  /** 2D array of field ownership (each cell contains a player/color index) */
  fields: number[][];
  /** List of coordinates that were updated in the last game tick */
  lastUpdatedCoords: Point[];
  /** Game board dimensions used for calculating field layout */
  dimension: Point;
}

/**
 * Renders the game board grid by drawing colored rectangles directly to a canvas.
 * Uses batched drawing by color to optimize performance.
 */
class Fields extends React.Component<Props, any> {
  layer: any;
  ctx: CanvasRenderingContext2D = undefined as any;
  canvasDim: Point = { X: 0, Y: 0 };
  coords: Point[] = [];
  redraw: boolean = false;

  /**
   * Initialize the canvas context after the component mounts.
   * Extracts the 2D drawing context from Konva's FastLayer for direct drawing operations.
   */
  componentDidMount() {
    var canvas = this.layer.canvas._canvas as any;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    let stage = this.layer.getStage() as Stage;
    this.canvasDim = { X: stage.width(), Y: stage.height() };
  }

  /**
   * Prepare the coordinates to draw before the next render.
   * Decides between incremental updates (only changed fields) or a full redraw (all fields).
   */
  componentWillUpdate(nextProps: Props) {
    let stage = this.layer.getStage() as Stage;

    if (
      !PointsAreEqual(this.props.dimension, nextProps.dimension) ||
      !PointsAreEqual(this.canvasDim, { X: stage.width(), Y: stage.height() })
    ) {
      this.coords = getAllCoords(nextProps.dimension);
      this.redraw = true;
    } else if (this.props.lastUpdatedCoords !== nextProps.lastUpdatedCoords) {
      if (!this.redraw) {
        this.coords = nextProps.lastUpdatedCoords;
      } else {
        this.redraw = false;
      }
    }

    this.canvasDim = { X: stage.width(), Y: stage.height() };
  }

  /**
   * Return the Konva FastLayer that will hold our canvas drawing context.
   * The actual rendering happens in componentDidUpdate via the canvas 2D API.
   */
  render() {
    return (
      <FastLayer
        ref={c => {
          this.layer = c;
        }}
      />
    );
  }

  /**
   * Draw fields to the canvas after React updates complete.
   * Groups consecutive fields by color and draws them in a single path to minimize fill() calls.
   */
  componentDidUpdate() {
    let fields = this.props.fields;

    if (this.coords.length === 0) {
      return;
    }

    let color: number = fields[this.coords[0].X][this.coords[0].Y];
    this.ctx.fillStyle = COLORS[color];
    this.ctx.shadowColor = "Grey";
    this.ctx.shadowBlur = COLORS[color] === "White" ? 0 : 2;
    this.ctx.globalAlpha = COLORS[color] === "White" ? 1 : 0.7;
    this.ctx.beginPath();

    this.coords.forEach(coord => {
      if (fields[coord.X][coord.Y] !== color) {
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.beginPath();

        color = fields[coord.X][coord.Y];
        this.ctx.shadowBlur = COLORS[color] === "White" ? 0 : 2;
        this.ctx.globalAlpha = COLORS[color] === "White" ? 1 : 0.7;
        this.ctx.fillStyle = COLORS[color];
      }

      this.drawRectangle(coord, this.props.dimension);
    });

    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.globalAlpha = 1;
  }

  /**
   * Compute the pixel layout for a field and add its rectangle to the current canvas path.
   * Called during componentDidUpdate for each coordinate to be drawn.
   */
  drawRectangle(fieldLocation: Point, dim: Point) {
    var X, Y, Width, Height;
    ({ X, Y, Width, Height } = layouter(dim, this.canvasDim, fieldLocation));

    this.ctx.rect(X, Y, Width, Height);
  }
}

export default Fields;
