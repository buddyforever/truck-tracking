import React, { Component } from "react";
import {
  Card,
  Row,
  Col,
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import Select from "react-select";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Aux from "../../../../hoc/_Aux";
import * as actionTypes from "../../../../store/actions";
import DEMO from "../../../../store/constant";

import GridView from "./GridView";
import TableView from "./TableView";

class Unloading extends Component {
  state = {
    viewMode: "grid",
    current: this.props.companyId > 0 ? this.props.companyId : 1,
  };
  onCompanyChange = (option) => {
    console.log(option);
    this.setState({ current: option.value });
  };

  onViewModeChange = (mode) => {
    this.setState({ viewMode: mode });
  };

  onDealClick = (dealId) => {
    this.props.history.push("/unloading/deal/" + dealId);
  };

  onTruckArrived = (dealId) => {
    console.log(dealId);
    this.props.onTruckArrived(dealId);
  };

  render() {
    let companyOptions = [];
    DEMO.companies.map((comp) => {
      companyOptions.push({
        value: comp.id,
        label: comp.companyName,
      });
    });

    let onroute_deals = this.props.deals.filter((deal) => {
      return deal.companyId == this.state.current && deal.status == 2;
    });
    let pending_deals = this.props.deals.filter((deal) => {
      return (
        deal.companyId == this.state.current &&
        (deal.status == 3 || deal.status == 4)
      );
    });

    let options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      colors: ["#f44236", "#f4c22b"],
      title: null,
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Trucks",
          colorByPoint: true,
          size: "90%",
          innerSize: "60%",
          data: [
            {
              name: "Truck on Road",
              y: onroute_deals.length,
            },
            {
              name: "Arrived",
              y: pending_deals.length,
            },
          ],
        },
      ],
    };

    return (
      <Aux>
        <Row className="mb-4">
          <Col md={{ span: 4, offset: 8 }} xl={{ span: 3, offset: 9 }}>
            <div className="d-flex align-items-center justify-content-end">
              {this.props.authUser.type == 1 ? (
                <Select
                  className="basic-single w-100 m-r-10"
                  classNamePrefix="select"
                  defaultValue={companyOptions[0]}
                  onChange={this.onCompanyChange}
                  name="company"
                  options={companyOptions}
                />
              ) : (
                <></>
              )}
              <ButtonToolbar>
                <ToggleButtonGroup
                  type="radio"
                  name="viewMode"
                  value={this.state.viewmode}
                  onChange={this.onViewModeChange}
                >
                  <ToggleButton
                    className="btn-icon shadow-1"
                    variant={
                      this.state.viewMode == "grid"
                        ? "outline-primary active"
                        : "outline-primary "
                    }
                    value={"grid"}
                  >
                    <i className="fa fa-th f-14 m-r-0" />
                  </ToggleButton>
                  <ToggleButton
                    className="btn-icon shadow-1"
                    variant={
                      this.state.viewMode == "table"
                        ? "outline-primary active"
                        : "outline-primary "
                    }
                    value={"table"}
                  >
                    <i className="fa fa-list f-14 m-r-0" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={8} xl={9}>
            {this.state.viewMode == "grid" ? (
              <GridView
                onroute_deals={onroute_deals}
                pending_deals={pending_deals}
                onTruckArrived={this.onTruckArrived}
                onDealClick={this.onDealClick}
              />
            ) : this.state.viewMode == "table" ? (
              <TableView
                onroute_deals={onroute_deals}
                pending_deals={pending_deals}
                onTruckArrived={this.onTruckArrived}
                onDealClick={this.onDealClick}
              />
            ) : (
              <></>
            )}
          </Col>
          <Col md={4} xl={3}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Truck on Road vs Arrived</Card.Title>
              </Card.Header>
              <Card.Body>
                <HighchartsReact highcharts={Highcharts} options={options} />
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
    deals: state.deals,
    authUser: state.authUser,
    companyId: state.companyId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTruckArrived: (dealId) =>
      dispatch({
        type: actionTypes.DEAL_STATUS_UPDATE,
        dealId: dealId,
        status: 3,
      }),
  };
};

export default withRouter(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Unloading)
  )
);
