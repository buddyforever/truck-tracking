import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Card, Table } from "react-bootstrap";

import Aux from "../../../../../hoc/_Aux";

import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require("datatables.net-responsive-bs");
let datatable;

class TruckDataHistory extends React.Component {
  componentDidMount() {
    this.initTable();
  }
  componentDidUpdate() {
    // if (datatable) {
    //   datatable.clear();
    //   datatable.rows.add(companyUsers);
    //   datatable.draw();
    // }
  }
  initTable = () => {
    let tableResponsive = "#truck-data-history-table";

    datatable = $(tableResponsive).DataTable({
      data: this.props.users,
      order: [[0, "desc"]],
      columns: [
        {
          data: "date",
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
          data: "transporter",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "netLoss",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "timeArrived",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "timeLoad",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "timeUnload",
          render: function(data, type, row) {
            return data;
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
                <Card.Title as="h5">Truck Data History</Card.Title>
              </Card.Header>
              <Card.Body>
                <Table
                  ref="tbl"
                  striped
                  hover
                  responsive
                  className="table table-condensed"
                  id="truck-data-history-table"
                >
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transporter</th>
                      <th>Driver</th>
                      <th>Net loss</th>
                      <th>Time to arrive</th>
                      <th>Time to load</th>
                      <th>Time to unload</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>Date</th>
                      <th>Transporter</th>
                      <th>Driver</th>
                      <th>Net loss</th>
                      <th>Time to arrive</th>
                      <th>Time to load</th>
                      <th>Time to unload</th>
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
  )(TruckDataHistory)
);
