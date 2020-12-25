import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Card } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";

import Aux from "../../../../../hoc/_Aux";

class AverageNetWeightLoss extends React.Component {
  getOption = () => {
    return {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        x: "left",
        data: [
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
        ],
      },
      color: [
        "#f4c22b",
        "#A389D4",
        "#3ebfea",
        "#4AA44A",
        "#1de9b6",
        "#1dc4e9",
        "#899FD4",
        "#f44236",
        "#88C832",
        "#04a9f5",
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
          data: [
            {
              value: 15,
              name: "January",
            },
            {
              value: 22,
              name: "Feburary",
            },
            {
              value: 36,
              name: "March",
            },
            {
              value: 5,
              name: "April",
            },
            {
              value: 8,
              name: "May",
            },
            {
              value: 11,
              name: "June",
            },
            {
              value: 27,
              name: "July",
            },
            {
              value: 42,
              name: "August",
            },
            {
              value: 33,
              name: "September",
            },
            {
              value: 11,
              name: "October",
            },
            {
              value: 17,
              name: "November",
            },
            {
              value: 22,
              name: "December",
            },
          ],
        },
      ],
    };
  };
  render() {
    return (
      <Aux>
        <ReactEcharts
          option={this.getOption()}
          style={{ height: "300px", width: "100%" }}
        />
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
  )(AverageNetWeightLoss)
);
