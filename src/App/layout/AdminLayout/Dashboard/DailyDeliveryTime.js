import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Row, Col, Card, Table } from "react-bootstrap";

import "amcharts3/amcharts/amcharts";
import "amcharts3/amcharts/serial";
import "amcharts3/amcharts/themes/light";
import AmCharts from "@amcharts/amcharts3-react";

import Aux from "../../../../hoc/_Aux";

function customFormatter(time) {
  let hour = parseInt(time / 3600);
  let min = parseInt((time - parseInt(time / 3600) * 3600) / 60);
  let sec = time - hour * 3600 - 60 * min;
  return (
    (hour > 0 ? hour + " hr " : "") +
    (min > 0 ? min + " min " : "") +
    sec +
    " s"
  );
}
class DailyDeliveryTime extends React.Component {
  state = {
    total_trucks: 0,
    arrived_trucks: 0,
    delivery_time: 0,
  };
  async componentDidMount() {
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const trucks_response = await axios.get(
      this.props.apiDomain + "/overview/getDailyNumTrucks/" + companyId
    );
    if (trucks_response.data.status == 200) {
      let result = trucks_response.data.result;
      this.setState({ total_trucks: result[0].numTotalTrucks });
    }
    const response = await axios.get(
      this.props.apiDomain + "/overview/getDailyDeliveryTime/" + companyId
    );
    if (response.data.status == 200) {
      let result = response.data.result;
      this.setState({
        arrived_trucks: result[0].numTrucks,
        delivery_time: result[0].deliveryTime,
      });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.companyId != this.props.companyId) {
      let companyId = this.props.companyId;
      const trucks_response = await axios.get(
        this.props.apiDomain + "/overview/getDailyNumTrucks/" + companyId
      );
      if (trucks_response.data.status == 200) {
        let result = trucks_response.data.result;
        this.setState({ total_trucks: result[0].numTotalTrucks });
      }
      const response = await axios.get(
        this.props.apiDomain + "/overview/getDailyDeliveryTime/" + companyId
      );
      if (response.data.status == 200) {
        let result = response.data.result;
        this.setState({
          arrived_trucks: result[0].numTrucks,
          delivery_time: result[0].deliveryTime,
        });
      }
    }
  }
  render() {
    return (
      <Aux>
        <Card>
          <Card.Body className="border-top">
            <h6 className="mb-4">Daily Time to Arrive</h6>
            <div className="row d-flex align-items-center">
              <div className="col-9">
                <h3 className="f-w-300 d-flex align-items-center m-b-0">
                  {/* <i className="feather icon-arrow-up text-c-green f-30 m-r-5" /> */}
                  {customFormatter(this.state.delivery_time)}
                </h3>
              </div>

              <div className="col-3 text-right">
                <p className="m-b-0">
                  {this.state.total_trucks != 0
                    ? (
                        (this.state.arrived_trucks / this.state.total_trucks) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="progress m-t-30" style={{ height: "7px" }}>
              <div
                className="progress-bar progress-c-theme"
                role="progressbar"
                style={{
                  width:
                    (this.state.arrived_trucks / this.state.total_trucks) *
                      100 +
                    "%",
                }}
                aria-valuenow={
                  (this.state.arrived_trucks / this.state.total_trucks) * 100
                }
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
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
  )(DailyDeliveryTime)
);
