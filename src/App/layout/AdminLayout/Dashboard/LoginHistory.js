import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Card, Table } from "react-bootstrap";

import Aux from "../../../../hoc/_Aux";

import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
const padLeft = function(num) {
  return num >= 10 ? num : "0" + num;
};

const formatDateTime = function(timestamp) {
  let dformat = "";
  if (timestamp) {
    var d = new Date(timestamp);
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
  }
  return dformat;
};
class Dashboard extends React.Component {
  state = {
    login_logs: [],
  };
  async componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      let companyId = this.props.companyId !== 0 ? this.props.companyId : 1;
      const response = await axios.get(
        this.props.apiDomain +
          "/overview/getLoginLogs/" +
          companyId +
          "/" +
          this.props.authUser.id
      );
      if (response.data.status === 200) {
        if (this.mounted) {
          this.setState({ login_logs: response.data.result });
        }
      }
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.companyId !== this.props.companyId) {
      if (this.mounted) {
        const response = await axios.get(
          this.props.apiDomain +
            "/overview/getLoginLogs/" +
            this.props.companyId +
            "/" +
            this.props.authUser.id
        );
        if (response.data.status === 200) {
          if (this.mounted) {
            this.setState({ login_logs: response.data.result });
          }
        }
      }
    }
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  render() {
    return (
      <Aux>
        <Card className="Recent-Users">
          <Card.Header>
            <Card.Title as="h5">Last Login History</Card.Title>
          </Card.Header>
          <Card.Body className="px-0 py-2">
            <Table responsive hover>
              <tbody>
                {this.state.login_logs.map((log) => {
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
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    apiDomain: state.apiDomain,
    authUser: state.authUser,
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
  )(Dashboard)
);
