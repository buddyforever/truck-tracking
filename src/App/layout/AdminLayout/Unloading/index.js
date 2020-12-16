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

class Unloading extends Component {
  render() {
    let onroute_deals = this.props.deals.filter((deal) => {
      return deal.status === "2";
    });
    let arrived_deals = this.props.deals.filter((deal) => {
      return deal.status === "3" || deal.status === "4";
    });

    const datum = [
      { key: "Truck on Road", y: onroute_deals.length, color: "#f44236" },
      { key: "Arrive", y: arrived_deals.length, color: "#1de9b6" },
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
                <h5>On Route</h5>
                <br />
                <Row>
                  {onroute_deals.map((deal) => {
                    return (
                      <Col md={6} xl={3} key={deal.id}>
                        <OverlayTrigger
                          overlay={<Tooltip>{deal.driverName}</Tooltip>}
                        >
                          <Link to="#">
                            <Button variant="danger">
                              <i className="fa fa-truck f-36 mr-0" />
                            </Button>
                          </Link>
                        </OverlayTrigger>
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
              <Card.Body>
                <h5>Pending</h5>
                <br />
                <Row>
                  {arrived_deals.map((deal) => {
                    return (
                      <Col md={6} xl={3} key={deal.id}>
                        <OverlayTrigger
                          overlay={<Tooltip>{deal.driverName}</Tooltip>}
                        >
                          <Link to="#">
                            <Button variant="success">
                              <i className="fa fa-truck f-36 mr-0" />
                            </Button>
                          </Link>
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
                <Card.Title as="h5">Truck on Road vs Arrive</Card.Title>
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
    )(Unloading)
  )
);
