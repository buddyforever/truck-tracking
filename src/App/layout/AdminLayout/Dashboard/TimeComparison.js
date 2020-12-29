import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Row, Col, Card, Table } from "react-bootstrap";

import { HorizontalBar } from "react-chartjs-2";

import Aux from "../../../../hoc/_Aux";

const padLeft = function(num) {
  return num >= 10 ? num : "0" + num;
};

const convertToDate = function(timestamp) {
  if (timestamp) {
    var d = new Date(timestamp),
      dformat = [
        d.getFullYear(),
        padLeft(d.getMonth() + 1),
        padLeft(d.getDate()),
      ].join("-");
  } else {
    var dformat = "";
  }
  return dformat;
};
class TimeComparison extends React.Component {
  state = {
    loaded_time: [],
    unloaded_time: [],
    dates: [],
  };
  async componentDidMount() {
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const response = await axios.get(
      this.props.apiDomain +
        "/overview/getDailyTotalLoadingUnloadingTime/" +
        companyId
    );
    if (response.data.status == 200) {
      let result = response.data.result;
      let dates = [];
      let times1 = [];
      let times2 = [];
      for (let i = 0; i < result.length; i++) {
        dates.push(convertToDate(result[i].date));
        times1.push((result[i].loading_time / 3600).toFixed(2));
        times2.push((result[i].unloading_time / 3600).toFixed(2));
      }
      this.setState({
        dates: dates,
        loaded_time: times1,
        unloaded_time: times2,
      });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.companyId != this.props.companyId) {
      let companyId = this.props.companyId;
      const response = await axios.get(
        this.props.apiDomain +
          "/overview/getDailyTotalLoadingUnloadingTime/" +
          companyId
      );
      if (response.data.status == 200) {
        let result = response.data.result;
        let dates = [];
        let times1 = [];
        let times2 = [];
        for (let i = 0; i < result.length; i++) {
          dates.push(convertToDate(result[i].date));
          times1.push((result[i].loading_time / 3600).toFixed(2));
          times2.push((result[i].unloading_time / 3600).toFixed(2));
        }
        this.setState({
          dates: dates,
          loaded_time: times1,
          unloaded_time: times2,
        });
      }
    }
  }
  render() {
    const data = (canvas) => {
      let bar = canvas.getContext("2d");
      let theme_g1 = bar.createLinearGradient(0, 300, 0, 0);
      theme_g1.addColorStop(0, "#1de9b6");
      theme_g1.addColorStop(1, "#1dc4e9");
      let theme_g2 = bar.createLinearGradient(0, 300, 0, 0);
      theme_g2.addColorStop(0, "#899FD4");
      theme_g2.addColorStop(1, "#A389D4");

      return {
        labels: this.state.dates,
        datasets: [
          {
            label: "Total loaded time",
            data: this.state.loaded_time,
            borderColor: theme_g1,
            backgroundColor: theme_g1,
            hoverBorderColor: theme_g1,
            hoverBackgroundColor: theme_g1,
          },
          {
            label: "Total unloaded time",
            data: this.state.unloaded_time,
            borderColor: theme_g2,
            backgroundColor: theme_g2,
            hoverBorderColor: theme_g2,
            hoverBackgroundColor: theme_g2,
          },
        ],
      };
    };
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Loaded Time Vs Unloaded Time</Card.Title>
          </Card.Header>
          <Card.Body className="border-top">
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
  )(TimeComparison)
);
