import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Card } from "react-bootstrap";

import Aux from "../../../../../hoc/_Aux";

import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require("datatables.net-responsive-bs");
let datatable;

class SupplierHistory extends React.Component {
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
    let tableResponsive = "#supplier-history-table";

    datatable = $(tableResponsive).DataTable({
      data: this.props.users,
      order: [[0, "asc"]],
      columns: [
        {
          data: "supplier",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "loss",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "deliveryTime",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "numTrips",
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
        <Table
          ref="tbl"
          striped
          hover
          responsive
          className="table table-condensed"
          id="supplier-history-table"
        >
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Loss</th>
              <th>Delivery Time</th>
              <th>Number of Trips</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>Supplier</th>
              <th>Loss</th>
              <th>Delivery Time</th>
              <th>Number of Trips</th>
            </tr>
          </tfoot>
        </Table>
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
  )(SupplierHistory)
);
