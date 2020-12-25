import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import PNotify from "pnotify/dist/es/PNotify";
import withReactContent from "sweetalert2-react-content";

import Aux from "../../../../hoc/_Aux";
import * as actionTypes from "../../../../store/actions";

import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require("datatables.net-responsive-bs");

let datatable1;
let datatable2;

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

  componentDidUpdate() {
    let onroute_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId == this.props.companyId || this.props.companyId == 0) &&
        deal.status == 2
      );
    });
    let pending_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId == this.props.companyId || this.props.companyId == 0) &&
        deal.status == 3
      );
    });

    datatable1.clear();
    datatable1.rows.add(onroute_deals);
    datatable1.draw();

    datatable2.clear();
    datatable2.rows.add(pending_deals);
    datatable2.draw();
  }

  onDealClick = (dealId) => {
    this.props.onDealClick(dealId);
  };

  onArrivedPopupShow = async (dealId) => {
    const response = await axios.get(
      this.props.apiDomain + "/deals/get/" + dealId
    );
    if (response.data.status == 200) {
      let deal = response.data.result[0];
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "Are you sure?",
        text: "If this truck is arrived, just click 'OK' button.",
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
      }).then(async (isArrived) => {
        if (isArrived.value) {
          deal.userId = this.props.authUser.id;
          let temp = deal.firstWeight;
          deal.firstWeight = deal.secondWeight;
          deal.secondWeight = temp;
          deal.startLoadingAt = formatDateTime(deal.startLoadingAt);
          deal.finishLoadingAt = formatDateTime(deal.finishLoadingAt);
          deal.startUnloadingAt = formatDateTime(new Date());
          deal.status = 3;
          deal.submitted = 1;
          console.log(deal);
          const res = await axios.post(
            this.props.apiDomain + "/deals/update",
            deal
          );
          if (res.data.status == 200) {
            PNotify.success({
              title: "Success",
              text: "There's new truck arrived.",
            });
            this.props.setCompanyDeals(res.data.result);
          }
        }
      });
    }
  };
  initTable = () => {
    let onroute_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId == this.props.companyId || this.props.companyId == 0) &&
        deal.status == 2
      );
    });
    let pending_deals = this.props.company_deals.filter((deal) => {
      return (
        (deal.companyId == this.props.companyId || this.props.companyId == 0) &&
        deal.status == 3
      );
    });
    datatable1 = $("#onroute-deals-table").DataTable({
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
        {
          targets: [5],
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
      data: pending_deals,
      order: [[1, "desc"]],
      columns: [
        {
          data: "id",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "startUnloadingAt",
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
    apiDomain: state.apiDomain,
    authUser: state.authUser,
    companyId: state.companyId,
    deals: state.deals,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCompanyDeals: (deals) =>
      dispatch({ type: actionTypes.COMPANY_DEALS_SET, deals: deals }),
  };
};

export default withRouter(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(TableView)
  )
);
