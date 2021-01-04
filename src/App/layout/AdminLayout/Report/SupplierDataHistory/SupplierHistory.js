import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Table, Card } from "react-bootstrap";

import Aux from "../../../../../hoc/_Aux";

import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require("datatables.net-responsive-bs");
require("datatables.net-buttons-bs");
require("datatables.net-buttons/js/buttons.colVis.js");
require("datatables.net-buttons/js/buttons.flash.js");
require("datatables.net-buttons/js/buttons.html5.js");
require("datatables.net-buttons/js/buttons.print.js");
let datatable;

class SupplierHistory extends React.Component {
  async componentDidMount() {
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const response = await axios.get(
      this.props.apiDomain + "/report/getSupplierDataHistory/" + companyId
    );
    if (response.data.status == 200) {
      let tableData = response.data.result;
      console.log(tableData);
      this.initTable(tableData);
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      this.props.companyId != prevProps.companyId ||
      prevProps.companyId != this.props.companyId
    ) {
      const response = await axios.get(
        this.props.apiDomain +
          "/report/getSupplierDataHistory/" +
          this.props.companyId
      );
      if (response.data.status == 200) {
        let tableData = response.data.result;
        if (datatable) {
          datatable.clear();
          datatable.rows.add(tableData);
          datatable.draw();
        }
      }
    }
  }
  initTable = (tableData) => {
    let tableResponsive = "#supplier-history-table";

    datatable = $(tableResponsive).DataTable({
      dom: "Bfrti",
      data: tableData,
      order: [[0, "asc"]],
      columns: [
        {
          data: "supplier",
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
          data: "deliveryTime",
          render: function(data, type, row) {
            return parseFloat(data).toFixed(2) + " hr";
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
      buttons: [
        {
          extend: "csvHtml5",
          text: "CSV",
          title: "Supplier Data History",
          className: "btn btn-sm btn-outline-primary",
        },
        {
          extend: "print",
          text: "Print",
          title: "Supplier Data History",
          className: "btn btn-sm btn-outline-primary",
        },
      ],
    });
  };
  render() {
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Supplier Data History</Card.Title>
          </Card.Header>
          <Card.Body>
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
