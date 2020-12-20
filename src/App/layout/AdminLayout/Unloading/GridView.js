import React, { Component } from "react";
import {
  Card,
  Row,
  Col,
  OverlayTrigger,
  Button,
  Tooltip,
  Form,
} from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Aux from "../../../../hoc/_Aux";

class GridView extends Component {
  state = {
    searchKey1: "",
    searchKey2: "",
  };
  onDealClick = (dealId) => {
    this.props.onDealClick(dealId);
  };
  onSearchKey1Change = (e) => {
    this.setState({ searchKey1: e.target.value });
  };
  onSearchKey2Change = (e) => {
    this.setState({ searchKey2: e.target.value });
  };
  onArrivedPopupShow = (dealId) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure?",
      text: "If this truck is arrived, just click 'OK' button.",
      type: "warning",
      showCloseButton: true,
      showCancelButton: true,
    }).then((isArrived) => {
      if (isArrived.value) {
        this.props.onTruckArrived(dealId);
        //this.props.onRemoveUser(userId);
        //eturn MySwal.fire("", "The user has been deleted!", "success");
      } else {
        //return MySwal.fire("", "This user is safe!", "error");
      }
    });
  };
  render() {
    return (
      <Aux>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">On Route</Card.Title>
                <div className="card-header-right">
                  <Form.Control
                    placeholder="Search..."
                    value={this.state.searchKey1}
                    onChange={(e) => this.onSearchKey1Change(e)}
                    autoComplete="off"
                  />
                </div>
              </Card.Header>
              <Card.Body className="border-bottom">
                <Row>
                  {this.props.onroute_deals
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
                                className="btn-circle w-80 m-0"
                                onClick={() => this.onArrivedPopupShow(deal.id)}
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
                  {this.props.pending_deals
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default GridView;
