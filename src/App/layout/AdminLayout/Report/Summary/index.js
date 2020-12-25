import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";

import Aux from "../../../../../hoc/_Aux";

import TruckHistory from "./TruckHistory";
import AverageDeliveryTime from "./AverageDeliveryTime";
import AverageNetWeightLoss from "./AverageNetWeightLoss";
import TruckDataHistory from "../TruckDataHistory";

class Summary extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">
                  Number of Trucks loaded/unloaded
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <TruckHistory title="Truck History" />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6} xl={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Average delivery time</Card.Title>
              </Card.Header>
              <Card.Body>
                <AverageDeliveryTime title="Average delivery time" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xl={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Average net weight loss</Card.Title>
              </Card.Header>
              <Card.Body>
                <AverageNetWeightLoss title="Average net weight loss" />
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Summary)
);
