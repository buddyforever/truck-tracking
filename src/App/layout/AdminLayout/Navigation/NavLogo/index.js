import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import DEMO from "./../../../../../store/constant";
import Aux from "../../../../../hoc/_Aux";

const navLogo = (props) => {
  let toggleClass = ["mobile-menu"];
  if (props.collapseMenu) {
    toggleClass = [...toggleClass, "on"];
  }
  let company = DEMO.companies.filter((comp) => {
    return comp.id == props.companyId;
  });
  return (
    <Aux>
      <div className="navbar-brand header-logo">
        <a href={DEMO.BLANK_LINK} className="b-brand">
          <div className="b-bg">
            <i className="feather icon-trending-up" />
          </div>
          <span className="b-title">{}</span>
        </a>
        <a
          href={DEMO.BLANK_LINK}
          className={toggleClass.join(" ")}
          id="mobile-collapse"
          onClick={props.onToggleNavigation}
        >
          <span />
        </a>
      </div>
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    companyId: state.companyId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(navLogo)
);
