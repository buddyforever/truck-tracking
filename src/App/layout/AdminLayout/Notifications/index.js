import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import Select from "react-select";
import windowSize from "react-window-size";
import { connect } from "react-redux";
import Aux from "../../../../hoc/_Aux";
import DEMO from "../../../../store/constant";
import * as actionTypes from "../../../../store/actions";

import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import avatar2 from "../../../../assets/images/user/avatar-2.jpg";
import avatar3 from "../../../../assets/images/user/avatar-3.jpg";

function timeDifferenceFromNow(datetime) {
  let now = new Date().getTime();
  let time = new Date(datetime).getTime();

  let diff = Math.abs(now - time) / 1000;
  return diff;
}

function customFormat(time) {
  let days = parseInt(time / (3600 * 24));
  let hours = parseInt((time - days * 3600 * 24) / 3600);
  let mins = parseInt((time - days * 3600 * 24 - hours * 3600) / 60);
  let secs = time - days * 3600 * 24 - hours * 3600 - mins * 60;
  if (days > 1) return days + " days ago";
  else if (days == 1) return "a day ago";
  else if (days == 0) {
    if (hours > 1) return hours + " hours ago";
    else if (hours == 1) return "an hour ago";
    else if (hours == 0) {
      if (mins > 1) return mins + " minutes ago";
      else if (mins == 1) return "a minute ago";
      else if (mins == 0) return "Just now";
    }
  }
}

class Notifications extends React.Component {
  async componentDidMount() {
    const response = await axios.get(
      this.props.apiDomain + "/notifications/get"
    );
    if (response.data.status == 200) {
      this.props.setNotifications(response.data.result);
    }
    const companies_response = await axios.get(
      this.props.apiDomain + `/companies/get`
    );
    if (companies_response.data.status == 200) {
      this.props.setCompanies(companies_response.data.result);
    }
  }
  onCompanyChange = (option) => {
    this.props.onCompanyChange(option.value);
  };
  render() {
    let avatars = [avatar1, avatar2, avatar3];
    let dot_class = [
      "text-c-green",
      "text-c-yellow",
      "text-c-blue",
      "text-c-red",
    ];

    let companyOptions = [{ value: 0, label: "All" }];
    this.props.companies.map((comp) => {
      companyOptions.push({
        value: comp.id,
        label: comp.companyName,
      });
    });
    let currentCompanyOption = companyOptions.filter(
      (comp) => comp.value == this.props.companyId
    );

    return (
      <Aux>
        <Row className="mb-4">
          <Col md={{ span: 4, offset: 8 }} xl={{ span: 3, offset: 9 }}>
            <div className="d-flex align-items-center justify-content-end">
              {this.props.authUser.type == 0 ? (
                <Select
                  className="basic-single w-100 m-r-10"
                  classNamePrefix="select"
                  value={
                    this.props.companyId != 0
                      ? currentCompanyOption[0]
                      : companyOptions[0]
                  }
                  onChange={this.onCompanyChange}
                  name="company"
                  options={companyOptions}
                />
              ) : (
                <></>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="note-bar">
              <Card.Header>
                <Card.Title as="h5">Notifications</Card.Title>
              </Card.Header>
              <Card.Body className="p-0">
                {this.props.notifications
                  .filter(
                    (item) =>
                      item.companyId == this.props.companyId ||
                      this.props.companyId == 0
                  )
                  .map((item, index) => {
                    return (
                      <a
                        href={DEMO.BLANK_LINK}
                        className={`media p-30 ${
                          index != 0 ? "border-top" : ""
                        }`}
                        key={item.id}
                      >
                        <div className="mr-3 photo-table">
                          {item.userId != 1 ? (
                            <>
                              <i
                                className={`fa fa-circle ${
                                  dot_class[index % 4]
                                } f-10 m-r-10`}
                              />
                              <img
                                className="rounded-circle"
                                style={{ width: "40px" }}
                                src={avatars[index % 3]}
                                alt="chat-user"
                              />
                            </>
                          ) : (
                            <>
                              <i
                                className={`fa fa-circle ${
                                  dot_class[index % 4]
                                } f-10 m-r-10`}
                              />
                              <i className="fa fa-bell text-c-yellow f-30 m-l-5 m-r-5" />
                            </>
                          )}
                        </div>
                        <div className="media-body">
                          <h6>
                            {item.userId != 1
                              ? item.firstname + " " + item.lastname
                              : "Daily report"}
                          </h6>
                          <span className="f-12 float-right text-muted">
                            {customFormat(
                              timeDifferenceFromNow(item.created_at)
                            )}
                          </span>
                          <p className="text-muted m-0">{item.notification}</p>
                        </div>
                      </a>
                    );
                  })}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    apiDomain: state.apiDomain,
    companies: state.companies,
    notifications: state.notifications,
    authUser: state.authUser,
    companyId: state.companyId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotifications: (notifications) =>
      dispatch({
        type: actionTypes.NOTIFICATIONS_SET,
        notifications: notifications,
      }),
    setCompanies: (companies) =>
      dispatch({
        type: actionTypes.COMPANIES_SET,
        companies: companies,
      }),
    onCompanyChange: (companyId) =>
      dispatch({ type: actionTypes.COMPANY_CHANGE, companyId: companyId }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(windowSize(Notifications))
);
