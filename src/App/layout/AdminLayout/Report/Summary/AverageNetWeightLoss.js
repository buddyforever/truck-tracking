import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Card } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";

import Aux from "../../../../../hoc/_Aux";

class AverageNetWeightLoss extends React.Component {
  state = {
    reportData: [],
  };
  async componentDidMount() {
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const response = await axios.get(
      this.props.apiDomain + "/report/getMonthlyNetLoss/" + companyId
    );
    if (response.data.status == 200) {
      this.setState({ reportData: response.data.result });
    }
  }
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
      for (let i = 1; i <= 12; i++) {
        for (let j = 0; j < this.state.reportData.length; j++) {
          if (i == this.state.reportData[j].month) {
            reportData[i - 1] = {
              value: this.state.reportData[j].netLoss,
              name: months[i - 1],
            };
            break;
          } else {
            reportData[i - 1] = { value: 0, name: months[i - 1] };
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
        data: months,
      },
      color: [
        "#04a9f5",
        "#A389D4",
        "#3ebfea",
        "#4AA44A",
        "#1de9b6",
        "#1dc4e9",
        "#899FD4",
        "#88C832",
        "#B3A800",
        "#9e9e9e",
        "#f44236",
        "#f4c22b",
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
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Average net weight loss</Card.Title>
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
