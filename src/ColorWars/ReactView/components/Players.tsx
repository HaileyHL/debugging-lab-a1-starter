import PlayerVisual from "../../ReduxStore/containers/PlayerVisual";
import KillsLabel from "../../ReduxStore/containers/KillsLabel";
import { Layer } from "react-konva";
import * as React from "react";
import { Player } from "../../utils/objectTypes";

/**
 * Props for Players component
 * - activePlayers: number of players currently active in the match
 * - phase: current game phase used to determine paused state
 * - players: array of player data objects
 */
export interface Props {
  activePlayers: number;
  phase: string;
  players: Player[];
}

/**
 * Players
 *
 * Renders visual representations for each active player and, when appropriate,
 * also renders per-player KillsLabel overlays while the game is paused.
 */
class Players extends React.Component<Props, object> {
  /**
   * Build the list of PlayerVisual components (one per active player) and optionally
   * append KillsLabel components for non-AI players when the game is paused.
   */
  render() {
    let playerComponents: JSX.Element[] = [];
    let killsLabelComponents: JSX.Element[] = [];

    // Determine whether the game is in a paused-like state where we show kills labels.
    const paused: boolean =
      this.props.phase === "paused"
        ? true
        : this.props.phase === "initializing"
        ? true
        : this.props.phase === "endGame"
        ? true
        : false;

    for (let i = 0; i < this.props.activePlayers; i++) {
      playerComponents.push(<PlayerVisual id={i} key={i.toString()} />);
      if (paused && !this.props.players[i].aiControlled) {
        killsLabelComponents.push(
          <KillsLabel id={i} key={i.toString() + "l"} />
        );
      }
    }

    return <Layer>{playerComponents.concat(killsLabelComponents)}</Layer>;
  }
}

export default Players;
