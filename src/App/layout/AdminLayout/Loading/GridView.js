import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  Row,
  Col,
  OverlayTrigger,
  Button,
  Tooltip,
  Form,
} from "react-bootstrap";

import Aux from "../../../../hoc/_Aux";
import truck1 from "./../../../../assets/images/truck1.png";
import truck2 from "./../../../../assets/images/truck2.jpg";
import truck3 from "./../../../../assets/images/truck3.png";

import wheat from "./../../../../assets/images/wheat.png";
import corn from "./../../../../assets/images/corn.png";
import meat from "./../../../../assets/images/meat.png";
import fish from "./../../../../assets/images/fish.png";
import chicken from "./../../../../assets/images/chicken.png";

class GridView extends Component {
  state = {
    searchKey1: "",
    searchKey2: "",
  };
  onDealClick = (dealId) => {
    this.props.onDealClick(dealId);
  };
  onNewLoadingClick = () => {
    this.props.onNewLoadingClick();
  };
  onSearchKey1Change = (e) => {
    this.setState({ searchKey1: e.target.value });
  };
  onSearchKey2Change = (e) => {
    this.setState({ searchKey2: e.target.value });
  };
  getDealDetailPercent = (deal) => {
    let confirmKeyArray = [];
    if (deal.companyId == 1)
      confirmKeyArray = [
        "truckPlate",
        "trailerPlate",
        "transporterId",
        "driverName",
        "driverPhone",
        "firstWeight",
        "secondWeight",
        "netWeight",
        "alertTime",
        "borderNumber",
        "receiptNumber",
        "description",
      ];
    else if (deal.companyId == 2)
      confirmKeyArray = [
        "truckPlate",
        "trailerPlate",
        "transporterId",
        "driverName",
        "driverPhone",
        "quantity",
        "alertTime",
        "borderNumber",
        "receiptNumber",
        "description",
      ];
    let numFilled = 0;
    let numTotal = confirmKeyArray.length;

    Object.entries(deal).forEach(([key, value]) => {
      if (confirmKeyArray.indexOf(key) > -1 && value) {
        numFilled++;
      }
    });
    return parseFloat(numFilled / numTotal).toFixed(1) * 100;
  };
  render() {
    let loading_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId == this.props.companyId || this.props.companyId == 0) &&
        deal.status == 1
      );
    });
    let onroute_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId == this.props.companyId || this.props.companyId == 0) &&
        deal.status == 2
      );
    });
    return (
      <Aux>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Pending</Card.Title>
                <div className="card-header-right">
                  <div className="d-flex align-items-center">
                    {this.props.authUser.type == 2 ? (
                      <OverlayTrigger overlay={<Tooltip>New loading</Tooltip>}>
                        <Button
                          variant="outline-info"
                          className="btn-rounded"
                          size="sm"
                          onClick={this.onNewLoadingClick}
                        >
                          New
                        </Button>
                      </OverlayTrigger>
                    ) : (
                      <></>
                    )}
                    <Form.Control
                      placeholder="Search..."
                      value={this.state.searchKey1}
                      onChange={(e) => this.onSearchKey1Change(e)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="border-bottom">
                <Row>
                  {loading_deals
                    .filter((deal) => {
                      return (
                        deal.truckPlate.indexOf(this.state.searchKey1) > -1 ||
                        this.state.searchKey1 == ""
                      );
                    })
                    .map((deal, index) => {
                      return (
                        <Col md={6} xl={3} key={deal.id}>
                          <OverlayTrigger
                            overlay={
                              <Tooltip>
                                {deal.driverName != ""
                                  ? deal.driverName
                                  : "Undefined"}
                              </Tooltip>
                            }
                          >
                            <div className="d-flex flex-column align-items-center m-b-20">
                              <div
                                data-label={`${this.getDealDetailPercent(
                                  deal
                                )}%`}
                                className={`radial-bar radial-bar-${this.getDealDetailPercent(
                                  deal
                                )} radial-bar-lg radial-bar-primary m-0`}
                                onClick={() => this.onDealClick(deal.id)}
                              >
                                <img
                                  src={
                                    deal.productName == "Wheat"
                                      ? wheat
                                      : deal.productName == "Corn"
                                      ? corn
                                      : deal.productName == "Meat"
                                      ? meat
                                      : deal.productName == "Fish"
                                      ? fish
                                      : deal.productName == "Chicken"
                                      ? chicken
                                      : truck1
                                  }
                                  alt="User-Avatar"
                                />
                              </div>
                              {/* <Button
                                variant="warning"
                                onClick={() => this.onDealClick(deal.id)}
                                className="btn-circle w-80 m-0"
                              >
                                <i className="fa fa-truck f-36 mr-0" />
                              </Button> */}
                              <h5 className="m-t-10">
                                {deal.truckPlate != ""
                                  ? deal.truckPlate
                                  : "Undefined"}
                              </h5>
                            </div>
                          </OverlayTrigger>
                        </Col>
                      );
                    })}
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">On Route</Card.Title>
                <div className="card-header-right">
                  <Form.Control
                    placeholder="Search..."
                    value={this.state.searchKey2}
                    onChange={(e) => this.onSearchKey2Change(e)}
                    autoComplete="off"
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  {onroute_deals
                    .filter((deal) => {
                      return (
                        deal.truckPlate.indexOf(this.state.searchKey2) > -1 ||
                        this.state.searchKey2 == ""
                      );
                    })
                    .map((deal) => {
                      return (
                        <Col
                          md={6}
                          xl={3}
                          key={deal.id}
                          className="text-center"
                        >
                          <OverlayTrigger
                            overlay={<Tooltip>{deal.driverName}</Tooltip>}
                          >
                            <div className="d-flex flex-column align-items-center m-b-20">
                              {/* <Button
                                variant="danger"
                                className="btn-circle w-80"
                                onClick={() => this.onDealClick(deal.id)}
                              >
                                <i className="fa fa-truck f-36 mr-0" />
                              </Button> */}
                              <div
                                data-label={
                                  this.getDealDetailPercent(deal) + "%"
                                }
                                className={`radial-bar radial-bar-${this.getDealDetailPercent(
                                  deal
                                )} radial-bar-lg radial-bar-danger m-0`}
                                onClick={() => this.onDealClick(deal.id)}
                              >
                                <img
                                  src={
                                    deal.productName == "Wheat"
                                      ? wheat
                                      : deal.productName == "Corn"
                                      ? corn
                                      : deal.productName == "Meat"
                                      ? meat
                                      : deal.productName == "Fish"
                                      ? fish
                                      : deal.productName == "Chicken"
                                      ? chicken
                                      : truck1
                                  }
                                  alt="User-Avatar"
                                />
                              </div>
                              <h5 className="m-t-10">{deal.truckPlate}</h5>
                            </div>
                          </OverlayTrigger>
                        </Col>
                      );
                    })}
                </Row>
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
    authUser: state.authUser,
    deals: state.deals,
    companyId: state.companyId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridView);
