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

class SupplierLoss extends React.Component {
  state = {
    dataum: [],
  };
  async componentDidMount() {
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    let colors = [
      ["#1de9b6", "#1dc4e9"],
      ["#a389d4", "#899ed4"],
      ["#04a9f5", "#049df5"],
      ["#f44236", "#f48f36"],
    ];
    const response = await axios.get(
      this.props.apiDomain + "/overview/getSupplierNetLoss/" + companyId
    );
    if (response.data.status == 200) {
      let result = response.data.result;
      let dataum = [];
      for (let i = 0; i < result.length; i++) {
        dataum[i] = {
          supplier: result[i].supplier,
          netLoss: result[i].netLoss,
          color: colors[i % result.length],
        };
      }
      this.setState({ dataum: dataum }, function() {
        this.init(dataum);
      });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.companyId != this.props.companyId) {
      let colors = [
        ["#1de9b6", "#1dc4e9"],
        ["#a389d4", "#899ed4"],
        ["#04a9f5", "#049df5"],
        ["#f44236", "#f48f36"],
      ];
      const response = await axios.get(
        this.props.apiDomain +
          "/overview/getSupplierNetLoss/" +
          this.props.companyId
      );
      if (response.data.status == 200) {
        let result = response.data.result;
        let dataum = [];
        for (let i = 0; i < result.length; i++) {
          dataum[i] = {
            supplier: result[i].supplier,
            netLoss: result[i].netLoss,
            color: colors[i % result.length],
          };
        }
        this.setState({ dataum: dataum }, function() {
          this.init();
        });
      }
    }
  }
  init = () => {
    AmCharts.makeChart("supplier-loss", {
      type: "serial",
      theme: "light",
      dataProvider: this.state.dataum,
      valueAxes: [
        {
          gridAlpha: 0,
          axisAlpha: 0,
          lineAlpha: 0,
          fontSize: 0,
        },
      ],
      startDuration: 1,
      graphs: [
        {
          balloonText: "<b>[[category]]: [[value]]</b>",
          fillColorsField: "color",
          fillAlphas: 0.9,
          lineAlpha: 0,
          columnWidth: 0.2,
          type: "column",
          valueField: "netLoss",
        },
      ],
      chartCursor: {
        categoryBalloonEnabled: false,
        cursorAlpha: 0,
        zoomable: false,
      },
      categoryField: "supplier",
      categoryAxis: {
        gridPosition: "start",
        gridAlpha: 0,
        axisAlpha: 0,
        lineAlpha: 0,
      },
    });
  };
  render() {
    let dot_colors_class = ["theme-bg", "theme-bg2", "bg-c-blue", "bg-c-red"];
    return (
      <Aux>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Supplier Loss</Card.Title>
              </Card.Header>
              <Card.Body className="pl-0 pr-0 pb-2">
                <div
                  id="supplier-loss"
                  className="lineChart ChartShadow w-100"
                  style={{ height: this.props.height }}
                />
              </Card.Body>
              <Card.Body className="border-top">
                <div className="row">
                  {this.state.dataum.length > 0 ? (
                    this.state.dataum.map((sup, index) => {
                      return (
                        <div className="col text-center" key={index}>
                          <span
                            className={`${
                              dot_colors_class[index]
                            } d-block rounded-circle mx-auto mb-2`}
                            style={{ width: "10px", height: "10px" }}
                          />
                          <h6 className="mb-2">{sup.netLoss}</h6>
                          <h6 className="mt-2 mb-0">{sup.supplier}</h6>
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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
  )(SupplierLoss)
);
