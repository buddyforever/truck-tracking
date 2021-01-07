import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Card } from "react-bootstrap";
import Select from "react-select";

import ReactEcharts from "echarts-for-react";

import Aux from "../../../../hoc/_Aux";

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
    diff = d.getDate() - day + (day === 0 ? -7 : 0);
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
class TimeComparison extends React.Component {
  state = {
    loaded_time: [],
    unloaded_time: [],
    yaxis: [],
    unit: "month",
  };
  async componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      let companyId = this.props.companyId !== 0 ? this.props.companyId : 1;
      const response = await axios.get(
        this.props.apiDomain +
          "/overview/getDailyTotalLoadingUnloadingTime/" +
          companyId +
          "/" +
          this.state.unit
      );
      if (response.data.status === 200) {
        let result = response.data.result;
        let times1 = [];
        let times2 = [];
        for (let i = 1; i <= 12; i++) {
          let flag = 0;
          for (let j = 0; j < result.length; j++)
            if (i === result[j].month) {
              times1.push((result[j].loading_time / 3600).toFixed(2));
              times2.push((result[j].unloading_time / 3600).toFixed(2));
              flag = 1;
              break;
            }
          if (!flag) {
            times1.push(0);
            times2.push(0);
          }
        }
        if (this.mounted) {
          this.setState({
            yaxis: months,
            loaded_time: times1,
            unloaded_time: times2,
          });
        }
      }
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.companyId !== this.props.companyId ||
      prevState.unit !== this.state.unit
    ) {
      if (this.mounted) {
        let companyId = this.props.companyId !== 0 ? this.props.companyId : 1;
        const response = await axios.get(
          this.props.apiDomain +
            "/overview/getDailyTotalLoadingUnloadingTime/" +
            companyId +
            "/" +
            this.state.unit
        );
        if (response.data.status === 200) {
          let result = response.data.result;
          let times1 = [];
          let times2 = [];
          if (this.state.unit === "month") {
            for (let i = 1; i <= 12; i++) {
              let flag = 0;
              for (let j = 0; j < result.length; j++)
                if (i === result[j].month) {
                  times1.push((result[j].loading_time / 3600).toFixed(2));
                  times2.push((result[j].unloading_time / 3600).toFixed(2));
                  flag = 1;
                  break;
                }
              if (!flag) {
                times1.push(0);
                times2.push(0);
              }
            }
            if (this.mounted) {
              this.setState({
                yaxis: months,
                loaded_time: times1,
                unloaded_time: times2,
              });
            }
          } else if (this.state.unit === "week") {
            let year = new Date().getFullYear();
            let month = new Date().getMonth();
            let firstday = new Date(year, month, 1).getDate();
            let lastday = new Date(year, month + 1, 0).getDate();
            let numWeeks = Math.ceil((lastday - firstday) / 7);
            let weeks = [];
            for (let i = 1; i <= numWeeks; i++) weeks.push(i);
            for (let i = 1; i <= weeks.length; i++) {
              let flag = 0;
              for (let j = 0; j < result.length; j++)
                if (i === result[j].week) {
                  times1.push((result[j].loading_time / 3600).toFixed(2));
                  times2.push((result[j].unloading_time / 3600).toFixed(2));
                  flag = 1;
                  break;
                }
              if (!flag) {
                times1.push(0);
                times2.push(0);
              }
            }
            if (this.mounted) {
              this.setState({
                yaxis: weeks,
                loaded_time: times1,
                unloaded_time: times2,
              });
            }
          } else if (this.state.unit === "day") {
            let sunday = getSunday(new Date());
            let week_days = [];
            for (let i = 0; i < 7; i++)
              week_days.push(customDateFormat(addDays(sunday, i)));
            for (let i = 1; i <= week_days.length; i++) {
              let flag = 0;
              for (let j = 0; j < result.length; j++)
                if (week_days[i - 1] === result[j].day) {
                  times1.push((result[j].loading_time / 3600).toFixed(2));
                  times2.push((result[j].unloading_time / 3600).toFixed(2));
                  flag = 1;
                  break;
                }
              if (!flag) {
                times1.push(0);
                times2.push(0);
              }
            }
            if (this.mounted) {
              this.setState({
                yaxis: week_days,
                loaded_time: times1,
                unloaded_time: times2,
              });
            }
          }
        }
      }
    }
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  unitOptionChanged = (option) => {
    this.setState({ unit: option.value });
  };
  getOption = () => {
    return {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Total Loaded Time", "Total Unloaded Time"],
      },
      color: ["rgba(163, 137, 212, 1)", "rgba(28, 233, 181, 1)"],
      calculable: true,
      xAxis: [
        {
          type: "value",
          boundaryGap: [0, 0.01],
        },
      ],
      yAxis: [
        {
          type: "category",
          data: this.state.yaxis,
        },
      ],
      series: [
        {
          name: "Total Loaded Time",
          type: "bar",
          data: this.state.loaded_time,
        },
        {
          name: "Total Unloaded Time",
          type: "bar",
          data: this.state.unloaded_time,
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
            <Card.Title as="h5">Loaded Time Vs Unloaded Time</Card.Title>
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
              style={{ height: this.props.height }}
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
  )(TimeComparison)
);
