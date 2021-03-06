import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";

import Aux from "../../../../hoc/_Aux";
import Summary from "./Summary";
import TruckDataHistory from "./TruckDataHistory";
import SupplierDataHistory from "./SupplierDataHistory";
class Report extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Summary</Card.Title>
              </Card.Header>
              <Card.Body>
                <Summary />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Truck Data History</Card.Title>
              </Card.Header>
              <Card.Body>
                <TruckDataHistory />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Supplier Data History</Card.Title>
              </Card.Header>
              <Card.Body>
                <SupplierDataHistory />
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
  )(Report)
);
