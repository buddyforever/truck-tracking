import React, { Component } from "react";
import {
  Card,
  Row,
  Col,
  OverlayTrigger,
  Button,
  Tooltip,
} from "react-bootstrap";

import Aux from "../../../../hoc/_Aux";

class GridView extends Component {
  onDealClick = (dealId) => {
    this.props.onDealClick(dealId);
  };
  render() {
    return (
      <Aux>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">On Route</Card.Title>
              </Card.Header>
              <Card.Body className="border-bottom">
                <Row>
                  {this.props.onroute_deals.map((deal) => {
                    return (
                      <Col md={6} xl={3} key={deal.id}>
                        <OverlayTrigger
                          overlay={<Tooltip>{deal.driverName}</Tooltip>}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <Button
                              variant="warning"
                              onClick={() => this.onDealClick(deal.id)}
                              className="btn-circle w-80 m-0"
                            >
                              <i className="fa fa-truck f-36 mr-0" />
                            </Button>
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
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Pending</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  {this.props.pending_deals.map((deal) => {
                    return (
                      <Col md={6} xl={3} key={deal.id} className="text-center">
                        <OverlayTrigger
                          overlay={<Tooltip>{deal.driverName}</Tooltip>}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <Button
                              variant="danger"
                              className="btn-circle w-80"
                            >
                              <i className="fa fa-truck f-36 mr-0" />
                            </Button>
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
    deals: state.deals,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default GridView;
