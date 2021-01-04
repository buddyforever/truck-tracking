import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";

import LoginHistory from "./LoginHistory";
import DailyDeliveryTime from "./DailyDeliveryTime.js";
import DailyLoss from "./DailyLoss.js";
import DailyTotal from "./DailyTotal";
import CompanyYearlyNetLoss from "./CompanyYearlyNetLoss";
import TimeComparison from "./TimeComparison";
import CompanyMonthlyTotalVsLoss from "./CompanyMonthlyTotalVsLoss";
import SupplierLoss from "./SupplierLoss";
import SupplierAvgDeliveryTime from "./SupplierAvgDeliveryTime";

import Aux from "../../../../hoc/_Aux";
import * as actionTypes from "../../../../store/actions";
class Dashboard extends React.Component {
  state = {
    login_logs: [],
  };
  async componentDidMount() {
    const response = await axios.get(this.props.apiDomain + `/companies/get`);
    if (response.data.status == 200) {
      this.props.setCompanies(response.data.result);
    }
  }
  onCompanyChange = (option) => {
    this.props.onCompanyChange(option.value);
  };
  render() {
    let companyOptions = [];
    this.props.companies.map((comp) => {
      companyOptions.push({
        value: comp.id,
        label: comp.companyName,
      });
    });
    let currentCompanyOption = companyOptions.filter(
      (comp) => comp.value == this.props.companyId
    );
    return (
      <Aux>
        <Row>
          <Col>
            <h1 className="mb-4 text-center">
              Welcome{" "}
              <span className="text-c-blue">
                {this.props.authUser.firstname +
                  " " +
                  this.props.authUser.lastname}
              </span>
            </h1>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={{ span: 4, offset: 8 }} xl={{ span: 3, offset: 9 }}>
            <div className="d-flex align-items-center justify-content-end">
              {this.props.authUser.type == 0 ? (
                <Select
                  className="basic-single w-100 m-r-10"
                  classNamePrefix="select"
                  value={
                    this.props.companyId != 0
                      ? currentCompanyOption[0]
                      : companyOptions[0]
                  }
                  onChange={this.onCompanyChange}
                  name="company"
                  options={companyOptions}
                />
              ) : (
                <></>
              )}
            </div>
          </Col>
        </Row>
        {this.props.authUser.type == 0 || this.props.authUser.type == 1 ? (
          <>
            <Row>
              <Col md={4} xl={4}>
                <DailyDeliveryTime />
              </Col>
              <Col md={4} xl={4}>
                <DailyLoss />
              </Col>
              <Col md={4} xl={4}>
                <DailyTotal />
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6}>
                <CompanyYearlyNetLoss height="320px" />
              </Col>
              <Col md={6} xl={6}>
                <TimeComparison />
              </Col>
            </Row>
            <Row>
              <Col md={12} xl={12}>
                <CompanyMonthlyTotalVsLoss height="330px" />
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6}>
                <SupplierLoss height="225px" />
              </Col>
              <Col md={6} xl={6}>
                <SupplierAvgDeliveryTime height="225px" />
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
        <Row>
          <Col md={12} xl={12}>
            <LoginHistory />
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
    companyId: state.companyId,
    companies: state.companies,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCompanies: (companies) =>
      dispatch({ type: actionTypes.COMPANIES_SET, companies: companies }),
    onCompanyChange: (companyId) =>
      dispatch({ type: actionTypes.COMPANY_CHANGE, companyId: companyId }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
