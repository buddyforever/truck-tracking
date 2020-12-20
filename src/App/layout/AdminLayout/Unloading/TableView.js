import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Aux from "../../../../hoc/_Aux";

import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require("datatables.net-responsive-bs");

let datatable1;
let datatable2;
class TableView extends Component {
  componentDidMount() {
    this.initTable();
  }

  componentDidUpdate() {
    datatable1.clear();
    datatable1.rows.add(this.props.onroute_deals);
    datatable1.draw();

    datatable2.clear();
    datatable2.rows.add(this.props.pending_deals);
    datatable2.draw();
  }

  onDealClick = (dealId) => {
    this.props.onDealClick(dealId);
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
  initTable = () => {
    datatable1 = $("#onroute-deals-table").DataTable({
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
        {
          targets: [4],
          data: null,
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <div className="table-actions text-center">
                <Button
                  className="shadow-1 btn-rounded btn-icon btn-sm"
                  variant="outline-success"
                  onClick={() => this.onArrivedPopupShow(rowData.id)}
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
    datatable2 = $("#pending-deals-table").DataTable({
      data: this.props.pending_deals,
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
                  <i className="fa fa-edit f-14" />
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
                <Card.Title as="h5">On Route</Card.Title>
              </Card.Header>
              <Card.Body className="border-bottom">
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

            <Card>
              <Card.Header>
                <Card.Title as="h5">Pending</Card.Title>
              </Card.Header>
              <Card.Body>
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
