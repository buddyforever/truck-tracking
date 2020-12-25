import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { connect } from "react-redux";

import Aux from "../../../../hoc/_Aux";

import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require("datatables.net-responsive-bs");

const padLeft = function(num) {
  return num >= 10 ? num : "0" + num;
};

const formatDateTime = function(timestamp) {
  if (timestamp) {
    var d = new Date(timestamp),
      dformat =
        [d.getFullYear(), padLeft(d.getMonth() + 1), padLeft(d.getDate())].join(
          "-"
        ) +
        " " +
        [
          padLeft(d.getHours()),
          padLeft(d.getMinutes()),
          padLeft(d.getSeconds()),
        ].join(":");
  } else {
    var dformat = "";
  }
  return dformat;
};

class TableView extends Component {
  componentDidMount() {
    this.initTable();
  }
  onDealClick = (dealId) => {
    this.props.onDealClick(dealId);
  };
  onNewLoadingClick = () => {
    this.props.onNewLoadingClick();
  };
  initTable = () => {
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
    console.log(loading_deals);
    console.log(onroute_deals);
    $("#pending-deals-table").DataTable({
      data: loading_deals,
      order: [[1, "desc"]],
      columns: [
        {
          data: "id",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "startLoadingAt",
          render: function(data, type, row) {
            return formatDateTime(data);
          },
        },
        {
          data: "transporter",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "driverName",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "truckPlate",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          targets: [5],
          data: null,
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <div className="table-actions text-center">
                <Button
                  className="shadow-1 btn-rounded btn-icon btn-sm"
                  variant="outline-success"
                  onClick={() => this.onDealClick(rowData.id)}
                >
                  <i className="fa fa-edit f-14" />
                </Button>
              </div>,
              td
            );
          },
        },
      ],
      // columnDefs: [
      //   {
      //     targets: [4],
      //     data: null,
      //     createdCell: (td, cellData, rowData) => {
      //       ReactDOM.render(
      //         <div className="table-actions text-center">
      //           <Button
      //             className="shadow-1 btn-rounded btn-icon btn-sm"
      //             variant="outline-success"
      //             onClick={() => this.onDealClick(rowData.id)}
      //           >
      //             <i className="fa fa-eye f-14" />
      //           </Button>
      //         </div>,
      //         td
      //       );
      //     },
      //   },
      // ],
      responsive: {
        responsive: {
          details: {
            display: $.fn.dataTable.Responsive.display.childRowImmediate,
            type: "",
          },
        },
      },
    });
    $("#onroute-deals-table").DataTable({
      data: onroute_deals,
      order: [[1, "desc"]],
      columns: [
        {
          data: "id",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "finishLoadingAt",
          render: function(data, type, row) {
            return formatDateTime(data);
          },
        },
        {
          data: "transporter",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "driverName",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "truckPlate",
          render: function(data, type, row) {
            return data;
          },
        },
      ],
      columnDefs: [
        {
          targets: [5],
          data: null,
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <div className="table-actions text-center">
                <Button
                  className="shadow-1 btn-rounded btn-icon btn-sm"
                  variant="outline-success"
                  onClick={() => this.onDealClick(rowData.id)}
                >
                  <i className="fa fa-eye f-14" />
                </Button>
              </div>,
              td
            );
          },
        },
      ],
      responsive: {
        responsive: {
          details: {
            display: $.fn.dataTable.Responsive.display.childRowImmediate,
            type: "",
          },
        },
      },
    });
  };
  render() {
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
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="border-bottom">
                <Table
                  ref="tbl"
                  striped
                  hover
                  responsive
                  className="table table-condensed"
                  id="pending-deals-table"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Entry Date Time</th>
                      <th>Transporter</th>
                      <th>Driver</th>
                      <th>Truck Plate</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>#</th>
                      <th>Entry Date Time</th>
                      <th>Transporter</th>
                      <th>Driver</th>
                      <th>Truck Plate</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title as="h5">On Route</Card.Title>
              </Card.Header>
              <Card.Body>
                <Table
                  ref="tbl"
                  striped
                  hover
                  responsive
                  className="table table-condensed"
                  id="onroute-deals-table"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Entry Date Time</th>
                      <th>Transporter</th>
                      <th>Driver</th>
                      <th>Truck Plate</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>#</th>
                      <th>Entry Date Time</th>
                      <th>Transporter</th>
                      <th>Driver</th>
                      <th>Truck Plate</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </tfoot>
                </Table>
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
    companyId: state.companyId,
    deals: state.deals,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableView);
