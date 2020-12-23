import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  Row,
  Col,
  OverlayTrigger,
  Button,
  Tooltip,
  Form,
} from "react-bootstrap";

import Aux from "../../../../hoc/_Aux";

class GridView extends Component {
  state = {
    searchKey1: "",
    searchKey2: "",
  };
  onDealClick = (dealId) => {
    this.props.onDealClick(dealId);
  };
  onNewLoadingClick = () => {
    this.props.onNewLoadingClick();
  };
  onSearchKey1Change = (e) => {
    this.setState({ searchKey1: e.target.value });
  };
  onSearchKey2Change = (e) => {
    this.setState({ searchKey2: e.target.value });
  };
  render() {
    let loading_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId == this.props.companyId || this.props.companyId == 0) &&
        deal.status == 1
      );
    });
    let onroute_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId == this.props.companyId || this.props.companyId == 0) &&
        deal.status == 2
      );
    });
    return (
      <Aux>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Pending</Card.Title>
                <div className="card-header-right">
                  <div className="d-flex align-items-center">
                    <OverlayTrigger overlay={<Tooltip>New loading</Tooltip>}>
                      <Button
                        variant="outline-info"
                        className="btn-rounded"
                        size="sm"
                        onClick={this.onNewLoadingClick}
                      >
                        New
                      </Button>
                    </OverlayTrigger>
                    <Form.Control
                      placeholder="Search..."
                      value={this.state.searchKey1}
                      onChange={(e) => this.onSearchKey1Change(e)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="border-bottom">
                <Row>
                  {loading_deals
                    .filter((deal) => {
                      return (
                        deal.truckPlate.indexOf(this.state.searchKey1) > -1 ||
                        this.state.searchKey1 == ""
                      );
                    })
                    .map((deal) => {
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
                <Card.Title as="h5">On Route</Card.Title>
                <div className="card-header-right">
                  <Form.Control
                    placeholder="Search..."
                    value={this.state.searchKey2}
                    onChange={(e) => this.onSearchKey2Change(e)}
                    autoComplete="off"
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  {onroute_deals
                    .filter((deal) => {
                      return (
                        deal.truckPlate.indexOf(this.state.searchKey2) > -1 ||
                        this.state.searchKey2 == ""
                      );
                    })
                    .map((deal) => {
                      return (
                        <Col
                          md={6}
                          xl={3}
                          key={deal.id}
                          className="text-center"
                        >
                          <OverlayTrigger
                            overlay={<Tooltip>{deal.driverName}</Tooltip>}
                          >
                            <div className="d-flex flex-column align-items-center">
                              <Button
                                variant="danger"
                                className="btn-circle w-80"
                                onClick={() => this.onDealClick(deal.id)}
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
    companyId: state.companyId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridView);
