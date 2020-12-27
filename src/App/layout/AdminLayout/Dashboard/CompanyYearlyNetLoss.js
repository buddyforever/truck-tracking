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

class CompanyYearlyLoss extends React.Component {
  async componentDidMount() {
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const response = await axios.get(
      this.props.apiDomain + "/overview/getYearlyLoss/" + companyId
    );
    if (response.data.status == 200) {
      let dataum = [];
      let result = response.data.result;
      let year = new Date().getFullYear();
      for (let i = year - 3; i <= year + 1; i++) {
        for (let j = 0; j < result.length; j++) {
          if (result[j].year == i) {
            dataum[i - year + 3] = {
              year: i.toString(),
              value: result[j].netLoss,
            };
            break;
          } else dataum[i - year + 3] = { year: i.toString(), value: 0 };
        }
      }
      this.init(dataum);
    }
  }
  init = (dataum) => {
    let maxValue = 0;
    for (let i = 0; i < dataum.length; i++)
      if (dataum[i].value > maxValue) maxValue = dataum[i].value;
    let chartm = AmCharts.makeChart("netLoss-chart", {
      type: "serial",
      addClassNames: true,
      defs: {
        filter: [
          {
            x: "-50%",
            y: "-50%",
            width: "200%",
            height: "200%",
            id: "blur",
            feGaussianBlur: {
              in: "SourceGraphic",
              stdDeviation: "30",
            },
          },
          {
            id: "shadow",
            x: "-10%",
            y: "-10%",
            width: "120%",
            height: "120%",
            feOffset: {
              result: "offOut",
              in: "SourceAlpha",
              dx: "0",
              dy: "20",
            },
            feGaussianBlur: {
              result: "blurOut",
              in: "offOut",
              stdDeviation: "10",
            },
            feColorMatrix: {
              result: "blurOut",
              type: "matrix",
              values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .2 0",
            },
            feBlend: {
              in: "SourceGraphic",
              in2: "blurOut",
              mode: "normal",
            },
          },
        ],
      },
      fontSize: 15,
      dataProvider: dataum,
      autoMarginOffset: 0,
      marginRight: 0,
      categoryField: "year",
      categoryAxis: {
        color: "#F44236",
        gridAlpha: 0,
        axisAlpha: 0,
        lineAlpha: 0,
        offset: -20,
        inside: true,
        parseDates: false,
        minPeriod: "YYYY",
      },
      valueAxes: [
        {
          fontSize: 0,
          inside: true,
          gridAlpha: 0,
          axisAlpha: 0,
          lineAlpha: 0,
          minimum: 0,
          maximum: (parseInt(maxValue / 10) + 1) * 10,
        },
      ],
      chartCursor: {
        valueLineEnabled: false,
        valueLineBalloonEnabled: false,
        cursorAlpha: 0,
        zoomable: false,
        valueZoomable: false,
        cursorColor: "#fff",
        categoryBalloonColor: "#95ead5",
        valueLineAlpha: 0,
      },
      graphs: [
        {
          id: "g1",
          type: "smoothedLine",
          valueField: "value",
          fillColors: ["#1de9b6", "#1dc4e9"],
          lineAlpha: 0,
          fillAlphas: 1,
          showBalloon: true,
          balloon: {
            drop: true,
            adjustBorderColor: false,
            color: "#ffffff",
            fillAlphas: 0.2,
            bullet: "round",
            bulletBorderAlpha: 1,
            bulletSize: 5,
            hideBulletsCount: 50,
            lineThickness: 2,
            useLineColorForBulletBorder: true,
            valueField: "value",
            balloonText: "<span style='font-size:18px;'>[[value]]</span>",
          },
        },
      ],
    });
    // setTimeout(() => {
    //   chartm.zoomToIndexes(1, dataum.length - 1);
    // }, 1000);
  };
  render() {
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Yearly Net Loss</Card.Title>
          </Card.Header>
          <Card.Body className="p-0">
            <div
              id="netLoss-chart"
              className="w-100"
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
  )(CompanyYearlyLoss)
);
