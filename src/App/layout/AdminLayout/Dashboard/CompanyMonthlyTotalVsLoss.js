import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Card } from "react-bootstrap";

import Aux from "../../../../hoc/_Aux";
import * as actionTypes from "../../../../store/actions";

import AmChartStatistics1 from "../../../../Demo/Widget/Chart/AmChartStatistics1";
class CompanyMonthlyTotalVsLoss extends React.Component {
  render() {
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Monthly Total vs Loss</Card.Title>
          </Card.Header>
          <Card.Body>
            <AmChartStatistics1 height={this.props.height} />
          </Card.Body>
        </Card>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    apiDomain: state.apiDomain,
    authUser: state.authUser,
    companyId: state.companyId,
    companies: state.companies,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CompanyMonthlyTotalVsLoss)
);
