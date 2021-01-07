import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Card } from "react-bootstrap";
import Datetime from "react-datetime";
import moment from "moment";

import Aux from "../../../../../hoc/_Aux";

import $ from "jquery";
import axios from "axios";
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

class TruckHistory extends React.Component {
  state = {
    from: "",
    to: "",
  };
  async componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      let tableData;
      let companyId = this.props.companyId !== 0 ? this.props.companyId : 1;
      const response = await axios.get(
        this.props.apiDomain + "/report/getDailyTruckNum/" + companyId
      );
      if (response.data.status === 200) {
        tableData = response.data.result;
        this.initTable(tableData);
      }
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.companyId !== this.props.companyId ||
      prevState.from !== this.state.from ||
      prevState.to !== this.state.to
    ) {
      if (this.mounted) {
        let companyId = this.props.companyId;
        const response = await axios.get(
          this.props.apiDomain + "/report/getDailyTruckNum/" + companyId
        );
        if (response.data.status === 200) {
          let tableData = response.data.result;
          if (this.state.from)
            tableData = tableData.filter(
              (item) => item.date >= this.state.from
            );
          if (this.state.to)
            tableData = tableData.filter((item) => item.date <= this.state.to);
          if (datatable) {
            datatable.clear();
            datatable.rows.add(tableData);
            datatable.draw();
          }
        }
      }
    }
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  initTable = (tableData) => {
    let tableResponsive = "#truck-history-table";

    datatable = $(tableResponsive).DataTable({
      dom: "Bfrti",
      data: tableData,
      order: [[0, "desc"]],
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
      buttons: [
        {
          extend: "csvHtml5",
          text: "CSV",
          title: "Number of Trucks loaded/unloaded",
          className: "btn btn-sm btn-outline-primary",
        },
        {
          extend: "print",
          text: "Print",
          title: "Number of Trucks loaded/unloaded",
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
            <Card.Title as="h5">Number of Trucks loaded/unloaded</Card.Title>
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
  )(TruckHistory)
);
