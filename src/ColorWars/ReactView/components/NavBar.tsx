import "rc-slider/assets/index.css";
import "../../Settings.css";
import * as actions from "../../ReduxStore/actionTypes";

import * as React from "react";
import { Button } from "react-bootstrap";

/**
 * Props for the NavBar component
 * - visible: whether settings panel is currently visible
 * - onShow: callback to toggle settings visibility
 */
export interface Props {
  visible: boolean;
  onShow: (value: boolean) => actions.ShowSettings;
}

/**
 * NavBar
 *
 * Simple navigation bar with a single button to show/hide the settings panel.
 * Comments explain function intent at a high level without going into line-by-line detail.
 */
class NavBar extends React.Component<Props, object> {
  /**
   * Prevent default browser behavior for mouse and keyboard interactions.
   * Kept separate so it can be attached to both mouse and keyboard events.
   */
  handleClick(e: any) {
    if (e) {
      e.preventDefault();
    }
  }

  /**
   * Render the NavBar with a single Button. The button label toggles depending on
   * the `visible` prop. Keyboard handling is supported by listening for Enter/Space
   * and delegating to the same handler used for mouse interactions.
   */
  render() {
    return (
      <div className="NavBar">
        <Button
          bsStyle="primary"
          onClick={this.onShow}
          onMouseDown={this.handleClick}
          onKeyUp={e => {
            if (e.keyCode === 13 || e.keyCode === 32) {
              this.handleClick(e);
            }
          }}
        >
          {this.props.visible ? "Hide settings" : "Show settings"}
        </Button>
      </div>
    );
  }

  /**
   * Toggle the visibility state by invoking the provided onShow callback with
   * the opposite of the current `visible` prop.
   */
  onShow = () => {
    this.props.onShow(!this.props.visible);
  };
}

export default NavBar;
