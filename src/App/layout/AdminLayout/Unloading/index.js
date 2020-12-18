import React, { Component } from "react";
import {
  Card,
  Row,
  Col,
  OverlayTrigger,
  Button,
  Tooltip,
  Tabs,
  Tab,
} from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import NVD3Chart from "react-nvd3";

import Aux from "../../../../hoc/_Aux";
import DEMO from "../../../../store/constant";

class Unloading extends Component {
  onDealClick = (dealId) => {
    this.props.history.push("/unloading/deal/" + dealId);
  };
  render() {
    console.log(this.props.authUser);
    let onroute_deals = this.props.deals.filter((deal) => {
      return deal.companyId == this.props.companyId && deal.status == 2;
    });
    let pending_deals = this.props.deals.filter((deal) => {
      return (
        deal.companyId == this.props.companyId &&
        (deal.status == 3 || deal.status == 4)
      );
    });
    let datum = [
      {
        key: "Truck loaded",
        y: onroute_deals.length,
        color: "#f4c22b",
      },
      { key: "On route", y: pending_deals.length, color: "#f44236" },
    ];

    return (
      <Aux>
        {this.props.authUser.type == 1 ? (
          <Tabs variant="pills" defaultActiveKey="1" className="mb-3">
            {DEMO.companies.map((item) => {
              onroute_deals = this.props.deals.filter((deal) => {
                return deal.companyId == item.id && deal.status == 2;
              });
              pending_deals = this.props.deals.filter((deal) => {
                return (
                  deal.companyId == item.id &&
                  (deal.status == 3 || deal.status == 4)
                );
              });
              datum = [
                {
                  key: "Truck on Road",
                  y: onroute_deals.length,
                  color: "#f4c22b",
                },
                { key: "Arrived", y: pending_deals.length, color: "#f44236" },
              ];
              return (
                <Tab eventKey={item.id} title={item.companyName} key={item.id}>
                  <Row>
                    <Col md={6} xl={8}>
                      <Card>
                        <Card.Header>
                          <Card.Title as="h5">Loading Live Screen</Card.Title>
                        </Card.Header>
                        <Card.Body className="border-bottom">
                          <h5>Pending</h5>
                          <br />
                          <Row>
                            {onroute_deals.map((deal) => {
                              return (
                                <Col md={6} xl={3} key={deal.id}>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip>{deal.driverName}</Tooltip>
                                    }
                                  >
                                    <Button
                                      variant="warning"
                                      onClick={() => this.onDealClick(deal.id)}
                                    >
                                      <i className="fa fa-truck f-36 mr-0" />
                                    </Button>
                                  </OverlayTrigger>
                                </Col>
                              );
                            })}
                          </Row>
                        </Card.Body>
                        <Card.Body>
                          <h5>On Route</h5>
                          <br />
                          <Row>
                            {pending_deals.map((deal) => {
                              return (
                                <Col md={6} xl={3} key={deal.id}>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip>{deal.driverName}</Tooltip>
                                    }
                                  >
                                    <Button variant="danger">
                                      <i className="fa fa-truck f-36 mr-0" />
                                    </Button>
                                  </OverlayTrigger>
                                </Col>
                              );
                            })}
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} xl={4}>
                      <Card>
                        <Card.Header>
                          <Card.Title as="h5">
                            Truck loaded vs On route
                          </Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <NVD3Chart
                            height={300}
                            type="pieChart"
                            datum={datum}
                            x="key"
                            y="y"
                            donut
                            labelType="percent"
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
              );
            })}
          </Tabs>
        ) : (
          <Row>
            <Col md={6} xl={8}>
              <Card>
                <Card.Header>
                  <Card.Title as="h5">Loading Live Screen</Card.Title>
                </Card.Header>
                <Card.Body className="border-bottom">
                  <h5>Pending</h5>
                  <br />
                  <Row>
                    {onroute_deals.map((deal) => {
                      return (
                        <Col md={6} xl={3} key={deal.id}>
                          <OverlayTrigger
                            overlay={<Tooltip>{deal.driverName}</Tooltip>}
                          >
                            <Button
                              variant="warning"
                              onClick={() => this.onDealClick(deal.id)}
                            >
                              <i className="fa fa-truck f-36 mr-0" />
                            </Button>
                          </OverlayTrigger>
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
                <Card.Body>
                  <h5>On Route</h5>
                  <br />
                  <Row>
                    {pending_deals.map((deal) => {
                      return (
                        <Col md={6} xl={3} key={deal.id}>
                          <OverlayTrigger
                            overlay={<Tooltip>{deal.driverName}</Tooltip>}
                          >
                            <Button variant="danger">
                              <i className="fa fa-truck f-36 mr-0" />
                            </Button>
                          </OverlayTrigger>
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} xl={4}>
              <Card>
                <Card.Header>
                  <Card.Title as="h5">Truck loaded vs On route</Card.Title>
                </Card.Header>
                <Card.Body>
                  <NVD3Chart
                    height={300}
                    type="pieChart"
                    datum={datum}
                    x="key"
                    y="y"
                    donut
                    labelType="percent"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
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
  return {};
};

export default withRouter(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Unloading)
  )
);
