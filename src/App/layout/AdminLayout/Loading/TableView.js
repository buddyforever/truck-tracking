import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import Aux from "../../../../hoc/_Aux";

import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require("datatables.net-responsive-bs");

class TableView extends Component {
  componentDidMount() {
    this.initTable();
  }
  onDealClick = (dealId) => {
    this.props.onDealClick(dealId);
  };
  initTable = () => {
    $("#pending-deals-table").DataTable({
      data: this.props.loading_deals,
      order: [[1, "asc"]],
      columns: [
        {
          data: "id",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "startedDateTime",
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
          targets: [4],
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
      data: this.props.onroute_deals,
      order: [[1, "asc"]],
      columns: [
        {
          data: "id",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "startedDateTime",
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
          targets: [4],
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
                      <th>Driver</th>
                      <th>Truck Plate</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>#</th>
                      <th>Entry Date Time</th>
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
                      <th>Driver</th>
                      <th>Truck Plate</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>#</th>
                      <th>Entry Date Time</th>
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
    deals: state.deals,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(TableView)
  )
);
