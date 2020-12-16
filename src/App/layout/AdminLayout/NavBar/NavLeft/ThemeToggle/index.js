import React, { Component } from "react";
import { connect } from "react-redux";
import windowSize from "react-window-size";

import Aux from "../../../../../../hoc/_Aux";
import * as actionTypes from "../../../../../../store/actions";

class ThemeToggle extends Component {
  state = {
    isDark: false,
  };
  toggleHandler = (e) => {
    if (!this.state.isDark) {
      this.props.onChangeLayoutType("dark");
      this.props.onChangeNavActiveListColor("active-lightblue");
    } else {
      this.props.onChangeLayoutType("navbar-default");
      this.props.onChangeNavBackColor("navbar-default");
    }
    this.setState({ isDark: !this.state.isDark });
  };

  render() {
    return (
      <Aux>
        <div id="theme-toggle">
          <div className="switch switch-info d-inline m-r-10">
            <input
              type="checkbox"
              id="unchecked-info"
              checked={this.state.isDark}
              onChange={(e) => this.toggleHandler(e)}
            />
            <label htmlFor="unchecked-info" className="cr" />
          </div>
          <label>Dark mode</label>
        </div>
      </Aux>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeLayoutType: (layoutType) =>
      dispatch({ type: actionTypes.LAYOUT_TYPE, layoutType: layoutType }),
    onChangeNavBackColor: (navBackColor) =>
      dispatch({ type: actionTypes.NAV_BACK_COLOR, layoutType: navBackColor }),
    onChangeNavActiveListColor: (navActiveListColor) =>
      dispatch({
        type: actionTypes.NAV_ACTIVE_LIST_COLOR,
        navActiveListColor: navActiveListColor,
      }),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(windowSize(ThemeToggle));
