import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";

import ChatList from "./ChatList";
import ThemeToggle from "../NavRight/ThemeToggle";
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";
import * as actionTypes from "../../../../../store/actions";

import Avatar1 from "../../../../../assets/images/user/avatar-1.jpg";
import Avatar2 from "../../../../../assets/images/user/avatar-2.jpg";
import Avatar3 from "../../../../../assets/images/user/avatar-3.jpg";

function timeDifferenceFromNow(datetime) {
  let now = new Date().getTime();
  let time = new Date(datetime).getTime();

  let diff = Math.abs(now - time) / 1000;
  return diff;
}

function customFormat(time) {
  let hour = parseInt(time / 3600);
  let min = parseInt((time - hour * 3600) / 60);
  let sec = time - hour * 3600 - min * 60;
  if (hour > 1) return hour + " hours ago";
  else if (hour == 1) return "an hour ago";
  else if (hour == 0) {
    if (min > 1) return min + " minutes ago";
    else if (min == 1) return "a minute ago";
    else if (min == 0) return "Just now";
  }
}
class NavRight extends Component {
  state = {
    listOpen: false,
  };

  async componentDidMount() {
    const response = await axios.get(
      this.props.apiDomain + "/notifications/get"
    );
    if (response.data.status == 200) {
      this.props.setNotifications(response.data.result);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.deals != prevProps.deals) {
      const response = await axios.get(
        this.props.apiDomain + "/notifications/get"
      );
      if (response.data.status == 200) {
        this.props.setNotifications(response.data.result);
      }
    }
  }

  onMarkAllAsRead = async () => {
    const response = await axios.post(
      this.props.apiDomain + "/notifications/markAllAsRead"
    );
    if (response.data.status == 200) {
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
    let avatars = [Avatar1, Avatar2, Avatar3];
    let unReadNotificatons = this.props.notifications
      .filter((item) => {
        return (
          item.status == 0 && timeDifferenceFromNow(item.created_at) <= 3600
        );
      })
      .slice(0, 6);
    let newNotifications = unReadNotificatons.slice(0, 3);
    let oldNotifications = unReadNotificatons.slice(3);
    return (
      <Aux>
        <ul className="navbar-nav ml-auto">
          {this.props.authUser.type == 1 ? (
            <li>
              <Link to="/notifications">
                <i className="icon feather icon-bell" />
              </Link>
            </li>
          ) : (
            // <li>
            //   <Dropdown alignRight={!this.props.rtlLayout}>
            //     <Dropdown.Toggle variant={"link"} id="dropdown-basic">
            //       <i className="icon feather icon-bell" />
            //     </Dropdown.Toggle>
            //     <Dropdown.Menu alignRight className="notification">
            //       <div className="noti-head">
            //         <h6 className="d-inline-block m-b-0">Notifications</h6>
            //         <div className="float-right">
            //           <a
            //             href="javascript:void(0)"
            //             className="m-r-10"
            //             onClick={this.onMarkAllAsRead}
            //           >
            //             mark as read
            //           </a>
            //         </div>
            //       </div>
            //       <ul className="noti-body">
            //         {newNotifications.length > 0 ? (
            //           <li className="n-title">
            //             <p className="m-b-0">NEW</p>
            //           </li>
            //         ) : (
            //           <></>
            //         )}
            //         {newNotifications.map((item, index) => {
            //           return (
            //             <li className="notification" key={item.id}>
            //               <div className="media">
            //                 {item.userId != 1 ? (
            //                   <img
            //                     src={avatars[index % 3]}
            //                     alt="Generic placeholder"
            //                   />
            //                 ) : (
            //                   <i className="fa fa-bell text-c-yellow m-r-20 f-30" />
            //                 )}
            //                 <div className="media-body">
            //                   <p>
            //                     <strong>
            //                       {item.userId != 1
            //                         ? item.firstname + " " + item.lastname
            //                         : "Daily report"}
            //                     </strong>
            //                     <span className="n-time text-muted">
            //                       <i className="icon feather icon-clock m-r-10" />
            //                       {customFormat(
            //                         timeDifferenceFromNow(item.created_at)
            //                       )}
            //                     </span>
            //                   </p>
            //                   <p>{item.notification}</p>
            //                 </div>
            //               </div>
            //             </li>
            //           );
            //         })}
            //         {oldNotifications.length > 0 ? (
            //           <li className="n-title">
            //             <p className="m-b-0">EARLIER</p>
            //           </li>
            //         ) : (
            //           <></>
            //         )}
            //         {oldNotifications.map((item, index) => {
            //           return (
            //             <li className="notification" key={item.id}>
            //               <div className="media">
            //                 {item.userId != 1 ? (
            //                   <img
            //                     className="img-radius"
            //                     src={avatars[index % 3]}
            //                     alt="Generic placeholder"
            //                   />
            //                 ) : (
            //                   <i className="fa fa-bell text-c-yellow m-r-20 f-30" />
            //                 )}
            //                 <div className="media-body">
            //                   <p>
            //                     <strong>
            //                       {item.userId != 1
            //                         ? item.firstname + " " + item.lastname
            //                         : "Daily report"}
            //                     </strong>
            //                     <span className="n-time text-muted">
            //                       <i className="icon feather icon-clock m-r-10" />
            //                       {customFormat(
            //                         timeDifferenceFromNow(item.created_at)
            //                       )}
            //                     </span>
            //                   </p>
            //                   <p>{item.notification}</p>
            //                 </div>
            //               </div>
            //             </li>
            //           );
            //         })}
            //       </ul>
            //       <div className="noti-footer">
            //         <a href="javascript:void(0)" onClick={this.onShowAll}>
            //           show all
            //         </a>
            //       </div>
            //     </Dropdown.Menu>
            //   </Dropdown>
            // </li>
            <></>
          )}

          <li>
            <ThemeToggle />
          </li>
          {/* <li className={this.props.rtlLayout ? "m-r-15" : "m-l-15"}>
            <a
              href={DEMO.BLANK_LINK}
              className="displayChatbox"
              onClick={() => {
                this.setState({ listOpen: true });
              }}
            >
              <i className="icon feather icon-mail" />
            </a>
          </li> */}
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
                    href="javascript:void(0)"
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
                      href="javascript:void(0)"
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
