import React, { Component } from "react";
import {
  Card,
  Row,
  Col,
  OverlayTrigger,
  Button,
  Tooltip,
} from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import NVD3Chart from "react-nvd3";

import Aux from "../../../../hoc/_Aux";

class Loading extends Component {
  onDealClick = (dealId) => {
    this.props.history.push("/loading/deal/" + dealId);
  };
  render() {
    let loading_deals = this.props.deals.filter((deal) => {
      return deal.status === "1";
    });
    let onroute_deals = this.props.deals.filter((deal) => {
      return deal.status === "2";
    });

    const datum = [
      { key: "Truck loaded", y: loading_deals.length, color: "#f4c22b" },
      { key: "On route", y: onroute_deals.length, color: "#f44236" },
    ];
    return (
      <Aux>
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
                  {loading_deals.map((deal) => {
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
                  {onroute_deals.map((deal) => {
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
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    deals: state.deals,
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
    )(Loading)
  )
);
