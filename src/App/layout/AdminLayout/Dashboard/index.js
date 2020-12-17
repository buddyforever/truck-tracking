import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Card, Table, Tabs, Tab } from "react-bootstrap";

import Aux from "../../../../hoc/_Aux";
import DEMO from "../../../../store/constant";

import AmChartStatistics1 from "../../../../Demo/Widget/Chart/AmChartStatistics1";

import avatar1 from "../../../../assets/images/user/avatar-1.jpg";

class Dashboard extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <h1 className="mb-4 text-center">
              Welcome{" "}
              {this.props.authUser.firstname +
                " " +
                this.props.authUser.lastname}
              !
            </h1>
          </Col>
        </Row>
        <Row>
          <Col md={6} xl={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Statistics</Card.Title>
              </Card.Header>
              <Card.Body>
                <AmChartStatistics1 height="330px" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xl={6}>
            <Card className="Recent-Users">
              <Card.Header>
                <Card.Title as="h5">Last Login History</Card.Title>
              </Card.Header>
              <Card.Body className="px-0 py-2">
                <Table responsive hover>
                  <tbody>
                    <tr className="unread">
                      <td>
                        <img
                          className="rounded-circle"
                          style={{ width: "40px" }}
                          src={avatar1}
                          alt="activity-user"
                        />
                      </td>
                      <td>
                        <h6 className="mb-1">IP Address: 137.34.51.28</h6>
                      </td>
                      <td>
                        <h6 className="text-muted">
                          <i className="fa fa-circle text-c-green f-10 m-r-15" />
                          2020-12-16 04:22:17
                        </h6>
                      </td>
                    </tr>
                    <tr className="unread">
                      <td>
                        <img
                          className="rounded-circle"
                          style={{ width: "40px" }}
                          src={avatar1}
                          alt="activity-user"
                        />
                      </td>
                      <td>
                        <h6 className="mb-1">IP Address: 28.11.151.112</h6>
                      </td>
                      <td>
                        <h6 className="text-muted">
                          <i className="fa fa-circle text-c-green f-10 m-r-15" />
                          2020-12-16 02:11:17
                        </h6>
                      </td>
                    </tr>
                    <tr className="unread">
                      <td>
                        <img
                          className="rounded-circle"
                          style={{ width: "40px" }}
                          src={avatar1}
                          alt="activity-user"
                        />
                      </td>
                      <td>
                        <h6 className="mb-1">IP Address: 27.134.15.128</h6>
                      </td>
                      <td>
                        <h6 className="text-muted">
                          <i className="fa fa-circle text-c-green f-10 m-r-15" />
                          2020-12-14 18:45:11
                        </h6>
                      </td>
                    </tr>
                    <tr className="unread">
                      <td>
                        <img
                          className="rounded-circle"
                          style={{ width: "40px" }}
                          src={avatar1}
                          alt="activity-user"
                        />
                      </td>
                      <td>
                        <h6 className="mb-1">IP Address: 137.34.51.28</h6>
                      </td>
                      <td>
                        <h6 className="text-muted">
                          <i className="fa fa-circle text-c-green f-10 m-r-15" />
                          2020-12-13 14:14:57
                        </h6>
                      </td>
                    </tr>
                    <tr className="unread">
                      <td>
                        <img
                          className="rounded-circle"
                          style={{ width: "40px" }}
                          src={avatar1}
                          alt="activity-user"
                        />
                      </td>
                      <td>
                        <h6 className="mb-1">IP Address: 137.34.51.28</h6>
                      </td>
                      <td>
                        <h6 className="text-muted">
                          <i className="fa fa-circle text-c-green f-10 m-r-15" />
                          2020-12-06 14:02:47
                        </h6>
                      </td>
                    </tr>
                  </tbody>
                </Table>
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
    authUser: state.authUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
