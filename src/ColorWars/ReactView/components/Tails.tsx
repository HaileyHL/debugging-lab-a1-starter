import { FastLayer } from "react-konva";
import { Rect, Node, Stage } from "konva";
import * as React from "react";

import { Point, Player } from "../../utils/objectTypes";
import {
  COLORS,
  layouter,
  COLOR_NUMS,
  PointsAreEqual,
} from "../../utils/functions";

export interface Props {
  tails: Point[][];
  players: Player[];
  dimension: Point;
}

/**
 * Tails
 *
 * Renders player 'tail' rectangles on a FastLayer. Uses prototypes for each
 * player to clone and add new tail rectangles efficiently. The component avoids
 * unnecessary re-renders and performs incremental updates (destroying/adding nodes)
 * when the tails array changes.
 */
class Tails extends React.Component<Props, object> {
  layer: any;
  tailPrototypes: Rect[] = [];
  canvasDimension: Point = { X: 0, Y: 0 };

  /**
   * Prevent React re-render when tails and dimension references haven't changed.
   * This keeps drawing fast by relying on manual canvas updates instead of JSX updates.
   */
  shouldComponentUpdate(nextProps: Props) {
    if (
      nextProps.tails === this.props.tails &&
      nextProps.dimension === this.props.dimension
    ) {
      return false;
    }
    return true;
  }

  /**
   * Render a Konva FastLayer and capture its ref for manual drawing operations.
   */
  render() {
    return (
      <FastLayer
        ref={(c) => {
          this.layer = c;
        }}
      />
    );
  }

  /**
   * Prepare and apply incremental tail updates before the component updates.
   * - Recreate prototypes if layout or player colors changed
   * - Destroy tail nodes that shrank
   * - Clone and add new tail nodes for newly extended tails
   */
  componentWillUpdate(nextProps: Props) {
    let stage = this.layer.getStage() as Stage;
    let newCanvDim = { X: stage.width(), Y: stage.height() };
    this.createPrototypesIfNecessary(nextProps, newCanvDim);
    this.canvasDimension = newCanvDim;

    let tailsToDestroy: number[] = this.calculateTailsToDestroy(
      nextProps.tails
    );
    let nodesToDraw: Point[][] = this.calculateNodesToDraw(nextProps.tails);

    // Destroy any tail nodes that are no longer needed.
    tailsToDestroy.forEach((num) => {
      let tail = this.layer.getChildren(
        (node: Node) => parseInt(node.name(), 10) === num
      );
      tail.forEach((node: Node) => {
        node.destroy();
      });
    });

    // Add any newly required tail nodes by cloning prototypes and positioning them.
    for (let i = 0; i < nodesToDraw.length; i++) {
      if (nodesToDraw[i] === undefined) {
        continue;
      }

      for (let j = 0; j < nodesToDraw[i].length; j++) {
        let p = nodesToDraw[i][j];

        let X, Y;
        ({ X, Y } = layouter(this.props.dimension, this.canvasDimension, p));

        let clone = this.tailPrototypes[i].clone({
          x: X,
          y: Y,
        });
        this.layer.add(clone);
      }
    }

    // Trigger a redraw of the layer to show added/removed nodes.
    this.layer.draw();
  }

  /**
   * Recreate prototypes when dimensions or player colors change.
   */
  createPrototypesIfNecessary(nextProps: Props, canvDim: Point) {
    if (
      !PointsAreEqual(nextProps.dimension, this.props.dimension) ||
      !PointsAreEqual(canvDim, this.canvasDimension) ||
      this.colorsHasChanged(nextProps.players)
    ) {
      this.createPrototypes(nextProps, canvDim);
    }
  }

  /**
   * Check whether the players' colors changed compared to cached prototypes.
   */
  colorsHasChanged(players: Player[]): boolean {
    for (let i = 0; i < players.length; i++) {
      if (this.tailPrototypes[i] === undefined) {
        return true;
      }

      let color = this.tailPrototypes[i].fill();
      // COLOR_NUMS is an object keyed by color names; the prototype.fill() returns
      // a string key. Cast to any to satisfy TypeScript indexing here (no runtime change).
      if (players[i].color !== (COLOR_NUMS as any)[color]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Create cached Rect prototypes for each player to be cloned when drawing tails.
   */
  createPrototypes(nextProps: Props, canvDim: Point) {
    let Width, Height;
    ({ Width, Height } = layouter(nextProps.dimension, canvDim, {
      X: 0,
      Y: 0,
    }));
    for (let i = 0; i < nextProps.players.length; i++) {
      if (this.tailPrototypes[i] !== undefined) {
        this.tailPrototypes[i].clearCache();
      }

      let color = COLORS[nextProps.players[i].color];

      let sh = new Rect({
        width: Width,
        height: Height,
        shadowBlur: 3,
        opacity: 0.25,
        fill: color,
        name: i.toString(),
      }) as any;
      sh.perfectDrawEnabled(false);
      sh.cache();

      this.tailPrototypes[i] = sh;
    }
  }

  /**
   * Determine which player tails shrank (so we can destroy their nodes).
   */
  calculateTailsToDestroy(tails: Point[][]) {
    let ret = [];
    for (let i = 0; i < this.props.tails.length; i++) {
      if (this.props.tails[i].length > tails[i].length) {
        ret.push(i);
      }
    }
    return ret;
  }

  /**
   * Determine the new nodes that need to be drawn for each tail (only the appended portion).
   */
  calculateNodesToDraw(tails: Point[][]) {
    let ret = [];
    for (let i = 0; i < this.props.tails.length; i++) {
      if (this.props.tails[i].length < tails[i].length) {
        ret[i] = tails[i].slice(this.props.tails[i].length);
      }
    }
    return ret;
  }
}

export default Tails;
