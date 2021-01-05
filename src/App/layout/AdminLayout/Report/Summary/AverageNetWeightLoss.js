import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Card } from "react-bootstrap";
import Select from "react-select";
import ReactEcharts from "echarts-for-react";

import Aux from "../../../../../hoc/_Aux";

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
class AverageNetWeightLoss extends React.Component {
  state = {
    reportData: [],
    yaxis: months,
    unit: "month",
  };
  async componentDidMount() {
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const response = await axios.get(
      this.props.apiDomain +
        "/report/getMonthlyNetLoss/" +
        companyId +
        "/" +
        this.state.unit
    );
    if (response.data.status == 200) {
      this.setState({ reportData: response.data.result });
      this.setState({ yaxis: months });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.companyId != this.props.companyId ||
      prevState.unit != this.state.unit
    ) {
      let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
      const response = await axios.get(
        this.props.apiDomain +
          "/report/getMonthlyNetLoss/" +
          companyId +
          "/" +
          this.state.unit
      );
      if (response.data.status == 200) {
        console.log(response.data.result);
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
  unitOptionChanged = (option) => {
    this.setState({ unit: option.value });
  };
  getOption = () => {
    let reportData = [];
    let months = [
      "January",
      "Feburary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "Octover",
      "November",
      "December",
    ];
    if (this.state.reportData.length > 0) {
      for (let i = 1; i <= this.state.yaxis.length; i++) {
        for (let j = 0; j < this.state.reportData.length; j++) {
          if (this.state.unit == "month") {
            if (i == this.state.reportData[j].month) {
              reportData[i - 1] = {
                value: this.state.reportData[j].netLoss,
                name: this.state.yaxis[i - 1],
              };
              break;
            } else
              reportData[i - 1] = { value: 0, name: this.state.yaxis[i - 1] };
          } else if (this.state.unit == "week") {
            if (i == this.state.reportData[j].week) {
              reportData[i - 1] = {
                value: this.state.reportData[j].netLoss,
                name: this.state.yaxis[i - 1],
              };
              break;
            } else
              reportData[i - 1] = { value: 0, name: this.state.yaxis[i - 1] };
          } else if (this.state.unit == "day") {
            if (this.state.yaxis[i - 1] == this.state.reportData[j].day) {
              reportData[i - 1] = {
                value: this.state.reportData[j].netLoss,
                name: this.state.yaxis[i - 1],
              };
              break;
            } else
              reportData[i - 1] = { value: 0, name: this.state.yaxis[i - 1] };
          }
        }
      }
    }
    return {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        x: "left",
        data: this.state.yaxis,
      },
      color: [
        "#04a9f5",
        "#A389D4",
        "#88C832",
        "#f44236",
        "#f4c22b",
        "#3ebfea",
        "#4AA44A",
        "#1de9b6",
        "#1dc4e9",
        "#899FD4",
        "#B3A800",
        "#9e9e9e",
      ],
      calculable: true,
      series: [
        {
          name: "Net Weight Loss",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: reportData,
        },
      ],
    };
  };
  render() {
    const unitOptions = [
      { value: "month", label: "Month" },
      { value: "week", label: "Week" },
      { value: "day", label: "Day" },
    ];
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Average net weight loss</Card.Title>
            <div className="card-header-right" style={{ width: "100px" }}>
              <Select
                className="basic-single w-100"
                classNamePrefix="select"
                defaultValue={unitOptions[0]}
                onChange={this.unitOptionChanged}
                name="color"
                options={unitOptions}
              />
            </div>
          </Card.Header>
          <Card.Body>
            <ReactEcharts
              option={this.getOption()}
              style={{ height: "300px", width: "100%" }}
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
  )(AverageNetWeightLoss)
);
