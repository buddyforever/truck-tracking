import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";

import Aux from "../../../../../hoc/_Aux";

import AverageLossPerTrips from "./AverageLossPerTrips";
import SupplierHistory from "./SupplierHistory";

class SupplierDataHistory extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col md={6} xl={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Supplier Data History</Card.Title>
              </Card.Header>
              <Card.Body>
                <SupplierHistory title="Supplier Data History" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xl={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Average of loss per x trips</Card.Title>
              </Card.Header>
              <Card.Body>
                <AverageLossPerTrips title="Average of loss per x trips" />
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
  )(SupplierDataHistory)
);
