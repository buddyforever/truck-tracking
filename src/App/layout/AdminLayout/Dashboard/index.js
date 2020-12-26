import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Row, Col, Card, Table } from "react-bootstrap";

import Aux from "../../../../hoc/_Aux";

import AmChartStatistics1 from "../../../../Demo/Widget/Chart/AmChartStatistics1";

import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
const padLeft = function(num) {
  return num >= 10 ? num : "0" + num;
};

const formatDateTime = function(timestamp) {
  if (timestamp) {
    var d = new Date(timestamp),
      dformat =
        [d.getFullYear(), padLeft(d.getMonth() + 1), padLeft(d.getDate())].join(
          "-"
        ) +
        " " +
        [
          padLeft(d.getHours()),
          padLeft(d.getMinutes()),
          padLeft(d.getSeconds()),
        ].join(":");
  } else {
    var dformat = "";
  }
  return dformat;
};
class Dashboard extends React.Component {
  state = {
    login_logs: [],
  };
  async componentDidMount() {
    const response = await axios.get(
      this.props.apiDomain + "/overview/getLoginLogs/" + this.props.authUser.id
    );
    if (response.data.status == 200) {
      this.setState({ login_logs: response.data.result });
    }
  }
  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <h1 className="mb-4 text-center">
              Welcome{" "}
              <span className="text-c-blue">
                {this.props.authUser.firstname +
                  " " +
                  this.props.authUser.lastname}
              </span>
            </h1>
          </Col>
        </Row>
        <Row>
          <Col md={12} xl={12}>
            <Card className="Recent-Users">
              <Card.Header>
                <Card.Title as="h5">Last Login History</Card.Title>
              </Card.Header>
              <Card.Body className="px-0 py-2">
                <Table responsive hover>
                  <tbody>
                    {this.state.login_logs.length > 0 ? (
                      this.state.login_logs.map((log) => {
                        return (
                          <tr className="unread" key={log.id}>
                            <td>
                              <img
                                className="rounded-circle"
                                style={{ width: "40px" }}
                                src={avatar1}
                                alt="activity-user"
                              />
                            </td>
                            <td>
                              <h6 className="mb-1">
                                {log.firstname + " " + log.lastname}
                              </h6>
                            </td>
                            <td>
                              <h6 className="text-muted">
                                {formatDateTime(log.login_at)}
                              </h6>
                            </td>
                            <td>
                              <h6 className="mb-1">
                                <i className="fa fa-circle text-c-green f-10 m-r-15" />
                                IP Address: {log.ip_address}
                              </h6>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Statistics</Card.Title>
              </Card.Header>
              <Card.Body>
                <AmChartStatistics1 height="330px" />
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
