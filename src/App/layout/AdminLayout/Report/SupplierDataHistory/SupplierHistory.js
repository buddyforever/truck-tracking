import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Table, Card } from "react-bootstrap";
import Datetime from "react-datetime";
import moment from "moment";

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
  state = { from: "", to: "" };
  async componentDidMount() {
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const response = await axios.get(
      this.props.apiDomain +
        "/report/getSupplierDataHistory/" +
        companyId +
        "?from=" +
        this.state.from +
        "&to=" +
        this.state.to
    );
    if (response.data.status == 200) {
      let tableData = response.data.result;
      this.initTable(tableData);
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      this.props.companyId != prevProps.companyId ||
      prevProps.companyId != this.props.companyId ||
      prevState.from != this.state.from ||
      prevState.to != this.state.to
    ) {
      const response = await axios.get(
        this.props.apiDomain +
          "/report/getSupplierDataHistory/" +
          this.props.companyId +
          "?from=" +
          this.state.from +
          "&to=" +
          this.state.to
      );
      if (response.data.status == 200) {
        let tableData = response.data.result;
        console.log(tableData);
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

  dateFromChanged = (date) => {
    this.setState({ from: moment(date).format("YYYY-MM-DD") });
  };

  dateToChanged = (date) => {
    this.setState({ to: moment(date).format("YYYY-MM-DD") });
  };

  render() {
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Supplier Data History</Card.Title>
            <div className="card-header-right" style={{ width: "300px" }}>
              <div className="d-flex align-items-center">
                <Datetime
                  className="m-r-10 w-100"
                  timeFormat={false}
                  inputProps={{ placeholder: "From" }}
                  dateFormat="YYYY-MM-DD"
                  value={this.state.from}
                  onChange={this.dateFromChanged}
                />
                <Datetime
                  className="w-100"
                  timeFormat={false}
                  inputProps={{ placeholder: "To" }}
                  dateFormat="YYYY-MM-DD"
                  value={this.state.to}
                  onChange={this.dateToChanged}
                />
              </div>
            </div>
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
