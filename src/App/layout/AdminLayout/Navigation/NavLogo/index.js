import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import DEMO from "./../../../../../store/constant";
import Aux from "../../../../../hoc/_Aux";

import FAB_LOGO from "../../../../../assets/images/logo_FAB_tiny.png";
import AFF_LOGO from "../../../../../assets/images/logo_AFF_tiny.png";

const navLogo = (props) => {
  let toggleClass = ["mobile-menu"];
  if (props.collapseMenu) {
    toggleClass = [...toggleClass, "on"];
  }
  let company = DEMO.companies.filter((comp) => {
    return comp.id === props.companyId;
  });
  let companyName = company.length > 0 ? company[0].companyName : "Admin";
  return (
    <Aux>
      <div className="navbar-brand header-logo">
        <a href={DEMO.BLANK_LINK} className="b-brand">
          {props.companyId === 1 ? (
            <img src={FAB_LOGO} alt={companyName} />
          ) : props.companyId === 2 ? (
            <img src={AFF_LOGO} alt={companyName} />
          ) : (
            <span className="b-title">{companyName}</span>
          )}
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
