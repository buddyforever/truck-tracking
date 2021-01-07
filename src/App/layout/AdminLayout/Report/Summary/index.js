import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";

import Aux from "../../../../../hoc/_Aux";
import * as actionTypes from "../../../../../store/actions";

import TruckHistory from "./TruckHistory";
import AverageDeliveryTime from "./AverageDeliveryTime";
import AverageNetWeightLoss from "./AverageNetWeightLoss";

class Summary extends React.Component {
  async componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      const response = await axios.get(this.props.apiDomain + `/companies/get`);
      if (response.data.status === 200) {
        if (this.mounted) {
          this.props.setCompanies(response.data.result);
        }
      }
    }
  }
  componentWillUnmount() {
    this.mounted = false;
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
      (comp) => comp.value === this.props.companyId
    );
    return (
      <Aux>
        <Row className="mb-4">
          <Col md={{ span: 4, offset: 8 }} xl={{ span: 3, offset: 9 }}>
            <div className="d-flex align-items-center justify-content-end">
              {this.props.authUser.type === 0 ? (
                <Select
                  className="basic-single w-100 m-r-10"
                  classNamePrefix="select"
                  value={
                    this.props.companyId !== 0
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
        <Row>
          <Col md={12} xl={12}>
            <TruckHistory title="Truck History" />
          </Col>
        </Row>
        <Row>
          <Col md={6} xl={6}>
            <AverageDeliveryTime title="Average delivery time" />
          </Col>
          <Col md={6} xl={6}>
            <AverageNetWeightLoss title="Average net weight loss" />
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
    companies: state.companies,
    companyId: state.companyId,
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
  )(Summary)
);
