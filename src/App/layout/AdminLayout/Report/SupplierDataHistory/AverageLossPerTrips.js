import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Card } from "react-bootstrap";

import { HorizontalBar } from "react-chartjs-2";

import Aux from "../../../../../hoc/_Aux";

class AverageLossPerTrips extends React.Component {
  componentDidMount() {}
  render() {
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
            label: "Average delivery time",
            data: [30, 52, 65, 65, 27, 44, 93, 11, 46, 72, 22, 74],
            borderColor: theme,
            backgroundColor: theme,
            hoverBorderColor: theme,
            hoverBackgroundColor: theme,
          },
        ],
      };
    };
    return (
      <Aux>
        <HorizontalBar
          data={data}
          options={{
            barValueSpacing: 20,
          }}
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
  )(AverageLossPerTrips)
);
