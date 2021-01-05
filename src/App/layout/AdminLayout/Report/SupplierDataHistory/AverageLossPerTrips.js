import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Card } from "react-bootstrap";
import Select from "react-select";

import { HorizontalBar } from "react-chartjs-2";

import Aux from "../../../../../hoc/_Aux";
import * as actionTypes from "../../../../../store/actions";

const months = [
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
];

function getSunday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -7 : 0);
  var sunday = new Date(d.setDate(diff));
  return sunday;
}

function addDays(date, days) {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
}
function customDateFormat(date) {
  let year = new Date(date).getFullYear();
  let month = new Date(date).getMonth() + 1;
  let day = new Date(date).getDate();
  return (
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (day < 10 ? "0" + day : day)
  );
}
class AverageLossPerTrips extends React.Component {
  state = {
    curTransporterId: 1,
    reportData: [],
    unit: "month",
    yaxis: months,
  };
  async componentDidMount() {
    const trans_response = await axios.get(
      this.props.apiDomain + "/transporters/get/"
    );
    if (trans_response.data.status == 200) {
      this.props.setTransporters(trans_response.data.result);
    }
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const response = await axios.get(
      this.props.apiDomain +
        "/report/getAverageLossPerTrip/" +
        companyId +
        "/" +
        this.state.curTransporterId +
        "/" +
        this.state.unit
    );
    if (response.data.status == 200) {
      this.setState({ reportData: response.data.result });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.companyId != this.props.companyId ||
      prevState.curTransporterId != this.state.curTransporterId ||
      prevState.unit != this.state.unit
    ) {
      let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
      const response = await axios.get(
        this.props.apiDomain +
          "/report/getAverageLossPerTrip/" +
          companyId +
          "/" +
          this.state.curTransporterId +
          "/" +
          this.state.unit
      );
      if (response.data.status == 200) {
        this.setState({ reportData: response.data.result });
        if (this.state.unit == "month") {
          this.setState({ yaxis: months });
        } else if (this.state.unit == "week") {
          let year = new Date().getFullYear();
          let month = new Date().getMonth();
          let firstday = new Date(year, month, 1).getDate();
          let lastday = new Date(year, month + 1, 0).getDate();
          let numWeeks = Math.ceil((lastday - firstday) / 7);
          let weeks = [];
          for (let i = 1; i <= numWeeks; i++) weeks.push(i);
          this.setState({ yaxis: weeks });
        } else if (this.state.unit == "day") {
          let sunday = getSunday(new Date());
          let week_days = [];
          for (let i = 0; i < 7; i++)
            week_days.push(customDateFormat(addDays(sunday, i)));
          this.setState({ yaxis: week_days });
        }
      }
    }
  }
  onTransOptionChanged = (option) => {
    this.setState({ curTransporterId: option.value });
  };
  onUnitOptionChanged = (option) => {
    this.setState({ unit: option.value });
  };
  render() {
    let reportData = [];
    if (this.state.reportData.length > 0) {
      for (let i = 1; i <= this.state.yaxis.length; i++) {
        for (let j = 0; j < this.state.reportData.length; j++) {
          if (this.state.unit == "month") {
            if (i == this.state.reportData[j].month) {
              reportData[i - 1] = this.state.reportData[j].avgLoss;
              break;
            } else reportData[i - 1] = 0;
          } else if (this.state.unit == "week") {
            if (i == this.state.reportData[j].week) {
              reportData[i - 1] = this.state.reportData[j].avgLoss;
              break;
            } else reportData[i - 1] = 0;
          } else if (this.state.unit == "day") {
            if (this.state.yaxis[i - 1] == this.state.reportData[j].day) {
              reportData[i - 1] = this.state.reportData[j].avgLoss;
              break;
            } else reportData[i - 1] = 0;
          }
        }
      }
    }
    const data = (canvas) => {
      let bar = canvas.getContext("2d");
      let theme = bar.createLinearGradient(0, 300, 0, 0);
      theme.addColorStop(0, "#899FD4");
      theme.addColorStop(1, "#A389D4");

      return {
        labels: this.state.yaxis,
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
    const unitOptions = [
      {
        label: "Month",
        value: "month",
      },
      {
        label: "Week",
        value: "week",
      },
      {
        label: "Day",
        value: "day",
      },
    ];
    let transOptions = [];
    for (let i = 0; i < this.props.transporters.length; i++)
      transOptions.push({
        value: this.props.transporters[i].id,
        label: this.props.transporters[i].transporter,
      });
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
                  defaultValue={unitOptions[0]}
                  onChange={this.onUnitOptionChanged}
                  name="unit"
                  options={unitOptions}
                />
                <Select
                  className="basic-single w-100"
                  classNamePrefix="select"
                  value={
                    transOptions.filter(
                      (t) => t.value == this.state.curTransporterId
                    )[0]
                  }
                  onChange={this.onTransOptionChanged}
                  name="transporter"
                  options={transOptions}
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
    transporters: state.transporters,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTransporters: (transporters) =>
      dispatch({
        type: actionTypes.TRANSPORTERS_SET,
        transporters: transporters,
      }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AverageLossPerTrips)
);
