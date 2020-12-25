import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Card } from "react-bootstrap";

import Aux from "../../../../../hoc/_Aux";

import $ from "jquery";
import axios from "axios";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require("datatables.net-responsive-bs");
let datatable;

class TruckHistory extends React.Component {
  state = {
    from: "",
    to: "",
  };
  async componentDidMount() {
    let tableData;
    const response = await axios.get(
      this.props.apiDomain + "/report/getDailyTruckNum",
      this.state
    );
    if (response.data.status == 200) {
      tableData = response.data.result;
      console.log(tableData);
      this.initTable(tableData);
    }
  }
  componentDidUpdate() {
    // if (datatable) {
    //   datatable.clear();
    //   datatable.rows.add(companyUsers);
    //   datatable.draw();
    // }
  }
  initTable = (tableData) => {
    let tableResponsive = "#truck-history-table";

    datatable = $(tableResponsive).DataTable({
      data: tableData,
      order: [[0, "asc"]],
      columns: [
        {
          data: "date",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "numTruckLoaded",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "numTruckUnloaded",
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
          id="truck-history-table"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Number of trucks loaded</th>
              <th>Number of trucks unloaded</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>Date</th>
              <th>Number of trucks loaded</th>
              <th>Number of trucks unloaded</th>
            </tr>
          </tfoot>
        </Table>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    apiDomain: state.apiDomain,
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
  )(TruckHistory)
);
