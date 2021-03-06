import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Card, Row, Col, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import PNotify from "pnotify/dist/es/PNotify";
import withReactContent from "sweetalert2-react-content";
import Aux from "../../../../hoc/_Aux";
import * as actionTypes from "../../../../store/actions";

import truck1 from "./../../../../assets/images/truck1.png";

import wheat from "./../../../../assets/images/wheat.png";
import corn from "./../../../../assets/images/corn.png";
import meat from "./../../../../assets/images/meat.png";
import fish from "./../../../../assets/images/fish.png";
import chicken from "./../../../../assets/images/chicken.png";

const padLeft = function(num) {
  return num >= 10 ? num : "0" + num;
};

const formatDateTime = function(timestamp) {
  let dformat = "";
  if (timestamp) {
    var d = new Date(timestamp);
    dformat =
      [d.getFullYear(), padLeft(d.getMonth() + 1), padLeft(d.getDate())].join(
        "-"
      ) +
      " " +
      [
        padLeft(d.getHours()),
        padLeft(d.getMinutes()),
        padLeft(d.getSeconds()),
      ].join(":");
  }
  return dformat;
};
class GridView extends Component {
  state = {
    searchKey1: "",
    searchKey2: "",
  };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  onDealClick = (dealId) => {
    this.props.onDealClick(dealId);
  };
  onSearchKey1Change = (e) => {
    this.setState({ searchKey1: e.target.value });
  };
  onSearchKey2Change = (e) => {
    this.setState({ searchKey2: e.target.value });
  };
  onArrivedPopupShow = async (dealId) => {
    if (this.mounted) {
      const response = await axios.get(
        this.props.apiDomain + "/deals/get/" + dealId
      );
      if (response.data.status === 200) {
        let deal = response.data.result[0];
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "Are you sure?",
          text: "If this truck is arrived, just click 'OK' button.",
          type: "warning",
          showCloseButton: true,
          showCancelButton: true,
        }).then(async (isArrived) => {
          if (isArrived.value) {
            deal.userId = this.props.authUser.id;
            let temp = deal.firstWeight;
            deal.firstWeight = deal.secondWeight;
            deal.secondWeight = temp;
            deal.startLoadingAt = formatDateTime(deal.startLoadingAt);
            deal.finishLoadingAt = formatDateTime(deal.finishLoadingAt);
            deal.startUnloadingAt = formatDateTime(new Date());
            deal.status = 3;
            deal.submitted = 1;
            const res = await axios.post(
              this.props.apiDomain + "/deals/update",
              deal
            );
            if (res.data.status === 200) {
              PNotify.success({
                title: "Success",
                text: "There's new truck arrived.",
              });
              this.props.setCompanyDeals(res.data.result);
            }
          }
        });
      }
    }
  };
  getDealDetailPercent = (deal) => {
    let confirmKeyArray = [];
    if (deal.companyId === 1)
      confirmKeyArray = [
        "truckPlate",
        "trailerPlate",
        "secondPlate",
        "transporterId",
        "driverName",
        "driverPhone",
        "firstWeight",
        "secondWeight",
        "netWeight",
        "newNetWeight",
        "alertTime",
        "borderNumber",
        "receiptNumber",
        "description",
        "newDescription",
        "startUnloadingAt",
      ];
    else if (deal.companyId === 2)
      confirmKeyArray = [
        "truckPlate",
        "trailerPlate",
        "secondPlate",
        "transporterId",
        "driverName",
        "driverPhone",
        "quantity",
        "newQuantity",
        "alertTime",
        "borderNumber",
        "receiptNumber",
        "description",
        "newDescription",
        "startUnloadingAt",
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
    let onroute_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId === this.props.companyId ||
          this.props.companyId === 0) &&
        deal.status === 2
      );
    });
    let pending_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId === this.props.companyId ||
          this.props.companyId === 0) &&
        deal.status === 3
      );
    });
    return (
      <Aux>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">On Route</Card.Title>
                <div className="card-header-right">
                  <Form.Control
                    placeholder="Search..."
                    value={this.state.searchKey1}
                    onChange={(e) => this.onSearchKey1Change(e)}
                    autoComplete="off"
                  />
                </div>
              </Card.Header>
              <Card.Body className="border-bottom">
                <Row>
                  {onroute_deals
                    .filter((deal) => {
                      return (
                        deal.truckPlate.indexOf(this.state.searchKey1) > -1 ||
                        this.state.searchKey1 === ""
                      );
                    })
                    .map((deal) => {
                      return (
                        <Col md={6} xl={3} key={deal.id}>
                          <OverlayTrigger
                            overlay={
                              <Tooltip>
                                {deal.driverName !== ""
                                  ? deal.driverName
                                  : "Undefined"}
                              </Tooltip>
                            }
                          >
                            <div className="d-flex flex-column align-items-center m-b-20">
                              {this.props.authUser.type === 0 ||
                              this.props.authUser.type === 1 ? (
                                <div
                                  data-label="100"
                                  className="radial-bar radial-bar-100 radial-bar-lg radial-bar-danger m-0"
                                  onClick={() => this.onDealClick(deal.id)}
                                >
                                  <img
                                    src={
                                      deal.productName === "Wheat"
                                        ? wheat
                                        : deal.productName === "Corn"
                                        ? corn
                                        : deal.productName === "Meat"
                                        ? meat
                                        : deal.productName === "Fish"
                                        ? fish
                                        : deal.productName === "Chicken"
                                        ? chicken
                                        : truck1
                                    }
                                    alt="User-Avatar"
                                  />
                                </div>
                              ) : (
                                <div
                                  data-label="100"
                                  className="radial-bar radial-bar-100 radial-bar-lg radial-bar-danger m-0"
                                  onClick={() =>
                                    this.onArrivedPopupShow(deal.id)
                                  }
                                >
                                  <img
                                    src={
                                      deal.productName === "Wheat"
                                        ? wheat
                                        : deal.productName === "Corn"
                                        ? corn
                                        : deal.productName === "Meat"
                                        ? meat
                                        : deal.productName === "Fish"
                                        ? fish
                                        : deal.productName === "Chicken"
                                        ? chicken
                                        : truck1
                                    }
                                    alt="User-Avatar"
                                  />
                                </div>
                              )}

                              <h5 className="m-t-10">
                                {deal.truckPlate !== ""
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
                <Card.Title as="h5">Pending</Card.Title>

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
                  {pending_deals
                    .filter((deal) => {
                      return (
                        deal.truckPlate.indexOf(this.state.searchKey2) > -1 ||
                        this.state.searchKey2 === ""
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
                              <div
                                data-label={`${this.getDealDetailPercent(
                                  deal
                                )}%`}
                                className={`radial-bar radial-bar-${this.getDealDetailPercent(
                                  deal
                                )} radial-bar-lg radial-bar-warning m-0`}
                                onClick={() => this.onDealClick(deal.id)}
                              >
                                <img
                                  src={
                                    deal.productName === "Wheat"
                                      ? wheat
                                      : deal.productName === "Corn"
                                      ? corn
                                      : deal.productName === "Meat"
                                      ? meat
                                      : deal.productName === "Fish"
                                      ? fish
                                      : deal.productName === "Chicken"
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
    apiDomain: state.apiDomain,
    authUser: state.authUser,
    deals: state.deals,
    companyId: state.companyId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCompanyDeals: (deals) =>
      dispatch({ type: actionTypes.COMPANY_DEALS_SET, deals: deals }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridView);
