import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";

import ChatList from "./ChatList";
import ThemeToggle from "../NavRight/ThemeToggle";
import Aux from "../../../../../hoc/_Aux";
import * as actionTypes from "../../../../../store/actions";
import DEMO from "../../../../../store/constant";

import Avatar2 from "../../../../../assets/images/user/avatar-2.jpg";
class NavRight extends Component {
  state = {
    listOpen: false,
  };

  async componentDidMount() {
    const response = await axios.get(
      this.props.apiDomain + "/notifications/get"
    );
    if (response.data.status === 200) {
      this.props.setNotifications(response.data.result);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.deals !== prevProps.deals) {
      const response = await axios.get(
        this.props.apiDomain + "/notifications/get"
      );
      if (response.data.status === 200) {
        this.props.setNotifications(response.data.result);
      }
    }
  }

  onMarkAllAsRead = async () => {
    const response = await axios.post(
      this.props.apiDomain + "/notifications/markAllAsRead"
    );
    if (response.data.status === 200) {
      this.props.setNotifications(response.data.result);
    }
  };

  onShowAll = () => {
    this.props.history.push("/notifications");
  };

  onSignOutPost = () => {
    this.props.onSignOutPost();
  };

  render() {
    return (
      <Aux>
        <ul className="navbar-nav ml-auto">
          {this.props.authUser.type === 0 || this.props.authUser.type === 1 ? (
            <li>
              <Link to="/notifications">
                <i className="icon feather icon-bell" />
              </Link>
            </li>
          ) : (
            <></>
          )}

          <li>
            <ThemeToggle />
          </li>
          <li>
            <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
              <Dropdown.Toggle variant={"link"} id="dropdown-basic">
                <img
                  src={Avatar2}
                  className="img-radius"
                  alt="User Profile"
                  width={40}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight className="profile-notification">
                <div className="pro-head">
                  <img
                    src={Avatar2}
                    className="img-radius"
                    alt="User Profile"
                  />
                  <span>
                    {this.props.authUser.firstname +
                      " " +
                      this.props.authUser.lastname}
                  </span>
                  <a
                    href={DEMO.BLANK_LINK}
                    className="dud-logout"
                    title="Logout"
                    onClick={this.onSignOutPost}
                  >
                    <i className="feather icon-log-out" />
                  </a>
                </div>
                <ul className="pro-body">
                  <li>
                    <a
                      href={DEMO.BLANK_LINK}
                      className="dropdown-item"
                      onClick={this.onSignOutPost}
                    >
                      <i className="feather icon-log-out" /> Log out
                    </a>
                  </li>
                </ul>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
        <ChatList
          listOpen={this.state.listOpen}
          closed={() => {
            this.setState({ listOpen: false });
          }}
        />
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    apiDomain: state.apiDomain,
    authUser: state.authUser,
    notifications: state.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignOutPost: () =>
      dispatch({
        type: actionTypes.AUTH_SIGNOUT_POST,
      }),
    setNotifications: (notifications) =>
      dispatch({
        type: actionTypes.NOTIFICATIONS_SET,
        notifications: notifications,
      }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavRight)
);
