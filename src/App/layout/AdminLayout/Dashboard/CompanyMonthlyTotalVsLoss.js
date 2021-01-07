import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Card } from "react-bootstrap";

import "amcharts3/amcharts/amcharts";
import "amcharts3/amcharts/serial";
import "amcharts3/amcharts/themes/light";
import AmCharts from "@amcharts/amcharts3-react";

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
class CompanyMonthlyTotalVsLoss extends React.Component {
  async componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      let companyId = this.props.companyId !== 0 ? this.props.companyId : 1;

      const response = await axios.get(
        this.props.apiDomain + "/overview/getMonthlyTotalVsLoss/" + companyId
      );
      if (response.data.status === 200) {
        let result = response.data.result;
        let dataum = [];
        for (let i = 1; i <= 12; i++) {
          let hasValue = 0;
          for (let j = 0; j < result.length; j++) {
            if (i === result[j].month) {
              dataum[i - 1] = {
                month: months[i - 1],
                total: result[j].total,
                loss: result[j].netLoss,
              };
              hasValue = 1;
              break;
            }
          }
          if (!hasValue)
            dataum[i - 1] = {
              month: months[i - 1],
              total: 0,
              loss: 0,
            };
        }
        this.init(dataum);
      }
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.companyId !== this.props.companyId) {
      if (this.mounted) {
        let companyId = this.props.companyId;
        const response = await axios.get(
          this.props.apiDomain + "/overview/getMonthlyTotalVsLoss/" + companyId
        );
        if (response.data.status === 200) {
          let result = response.data.result;
          let dataum = [];
          for (let i = 1; i <= 12; i++) {
            let hasValue = 0;
            for (let j = 0; j < result.length; j++) {
              if (i === result[j].month) {
                dataum[i - 1] = {
                  month: months[i - 1],
                  total: result[j].total,
                  loss: result[j].netLoss,
                };
                hasValue = 1;
                break;
              }
            }
            if (!hasValue)
              dataum[i - 1] = {
                month: months[i - 1],
                total: 0,
                loss: 0,
              };
          }
          this.init(dataum);
        }
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  init = (dataum) => {
    AmCharts.makeChart("monthly-total-vs-loss", {
      type: "serial",
      theme: "light",
      marginTop: 10,
      marginRight: 0,
      dataProvider: dataum,
      valueAxes: [
        {
          axisAlpha: 0,
          position: "left",
        },
      ],
      graphs: [
        {
          id: "g1",
          balloonText:
            "Total: <br><b><span style='font-size:14px;'>[[value]]</span></b>",
          bullet: "round",
          lineColor: "#1de9b6",
          lineThickness: 3,
          negativeLineColor: "#1de9b6",
          valueField: "total",
        },
        {
          id: "g2",
          balloonText:
            "Net loss: <br><b><span style='font-size:14px;'>[[value]]</span></b>",
          bullet: "round",
          lineColor: "#10adf5",
          lineThickness: 3,
          negativeLineColor: "#10adf5",
          valueField: "loss",
        },
      ],
      chartCursor: {
        cursorAlpha: 0,
        valueLineEnabled: true,
        valueLineBalloonEnabled: true,
        valueLineAlpha: 0.3,
        fullWidth: true,
      },
      categoryField: "month",
      categoryAxis: {
        minorGridAlpha: 0,
        minorGridEnabled: true,
        gridAlpha: 0,
        axisAlpha: 0,
        lineAlpha: 0,
      },
      legend: {
        useGraphSettings: true,
        position: "top",
      },
    });
  };

  render() {
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Monthly Total vs Loss</Card.Title>
          </Card.Header>
          <Card.Body>
            <div
              id="monthly-total-vs-loss"
              className="lineAreaDashboard"
              style={{ width: "100%", height: this.props.height }}
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
    companies: state.companies,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CompanyMonthlyTotalVsLoss)
);
