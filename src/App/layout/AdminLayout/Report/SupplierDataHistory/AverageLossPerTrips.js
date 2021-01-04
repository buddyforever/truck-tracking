import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Card } from "react-bootstrap";
import Select from "react-select";

import { HorizontalBar } from "react-chartjs-2";

import Aux from "../../../../../hoc/_Aux";
class AverageLossPerTrips extends React.Component {
  state = {
    curTransporterId: 1,
    reportData: [],
    transOptions: [],
    curYear: new Date().getFullYear(),
  };
  async componentDidMount() {
    const trans_response = await axios.get(
      this.props.apiDomain + "/transporters/get/"
    );
    if (trans_response.data.status == 200) {
      let transporters = [];
      for (let i = 0; i < trans_response.data.result.length; i++)
        transporters.push({
          value: trans_response.data.result[i].id,
          label: trans_response.data.result[i].transporter,
        });
      this.setState({ transOptions: transporters });
    }
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    let curYear = new Date().getFullYear();
    const response = await axios.get(
      this.props.apiDomain +
        "/report/getAverageLossPerTrip/" +
        companyId +
        "/" +
        this.state.curTransporterId +
        "/" +
        curYear
    );
    if (response.data.status == 200) {
      this.setState({ reportData: response.data.result });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.curTransporterId != this.state.curTransporterId ||
      prevProps.companyId != this.props.companyId ||
      prevState.curYear != this.state.curYear
    ) {
      let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
      const response = await axios.get(
        this.props.apiDomain +
          "/report/getAverageLossPerTrip/" +
          companyId +
          "/" +
          this.state.curTransporterId +
          "/" +
          this.state.curYear
      );
      if (response.data.status == 200) {
        this.setState({ reportData: response.data.result });
      }
    }
  }
  onTransOptionChanged = (option) => {
    this.setState({ curTransporterId: option.value });
  };
  onYearOptionChanged = (option) => {
    this.setState({ curYear: option.value });
  };
  render() {
    let reportData = [];
    if (this.state.reportData.length > 0) {
      for (let i = 1; i <= 12; i++) {
        for (let j = 0; j < this.state.reportData.length; j++) {
          if (i == this.state.reportData[j].month) {
            reportData[i - 1] = this.state.reportData[j].avgLoss;
            break;
          } else reportData[i - 1] = 0;
        }
      }
    }
    const data = (canvas) => {
      let bar = canvas.getContext("2d");
      let theme = bar.createLinearGradient(0, 300, 0, 0);
      theme.addColorStop(0, "#899FD4");
      theme.addColorStop(1, "#A389D4");

      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Average of loss per x trips",
            data: reportData,
            borderColor: theme,
            backgroundColor: theme,
            hoverBorderColor: theme,
            hoverBackgroundColor: theme,
          },
        ],
      };
    };
    let nowYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = nowYear; i >= 2000; i--) {
      yearOptions.push({ label: i, value: i });
    }
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Average of loss per x trips</Card.Title>
            <div className="card-header-right" style={{ width: "300px" }}>
              <div className="d-flex align-items-center">
                <Select
                  className="basic-single w-100 m-r-10"
                  classNamePrefix="select"
                  defaultValue={yearOptions[0]}
                  onChange={this.onYearOptionChanged}
                  name="color"
                  options={yearOptions}
                />
                <Select
                  className="basic-single w-100"
                  classNamePrefix="select"
                  defaultValue={this.state.transOptions[0]}
                  onChange={this.onTransOptionChanged}
                  name="color"
                  options={this.state.transOptions}
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <HorizontalBar
              data={data}
              options={{
                barValueSpacing: 20,
              }}
            />
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
  )(AverageLossPerTrips)
);
