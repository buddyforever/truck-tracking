import React from "react";
import ReactDOM from "react-dom";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card, Table, Dropdown, Button } from "react-bootstrap";
import Select from "react-select";
import windowSize from "react-window-size";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PNotify from "pnotify/dist/es/PNotify";

import Aux from "../../../../hoc/_Aux";
import DEMO from "../../../../store/constant";
import * as actionTypes from "../../../../store/actions";

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

class Suppliers extends React.Component {
  state = {
    fullCard: false,
    current: this.props.companyId,
  };

  async componentDidMount() {
    const response = await axios.get(
      this.props.apiDomain + `/transporters/get`
    );
    if (response.data.status == 200) {
      this.props.setTransporters(response.data.result);
      this.initTable();
    }
  }

  cardHeaderRight = (
    <div className="card-header-right">
      <Dropdown alignRight={true} className="btn-group card-option">
        <Dropdown.Toggle id="dropdown-basic" className="btn-icon">
          <i className="feather icon-more-horizontal" />
        </Dropdown.Toggle>
        <Dropdown.Menu as="ul" className="list-unstyled card-option">
          <Dropdown.Item as="li" className="dropdown-item">
            <i className="feather icon-layers" />
            <Link to="/suppliers/add"> Add a transporter </Link>
          </Dropdown.Item>
          <Dropdown.Item
            as="li"
            className="dropdown-item"
            onClick={() => {
              this.setState((prevState) => {
                return { fullCard: !prevState.fullCard };
              });
            }}
          >
            <i
              className={
                this.state.fullCard
                  ? "feather icon-minimize"
                  : "feather icon-maximize"
              }
            />
            <a href={DEMO.BLANK_LINK}>
              {" "}
              {this.state.fullCard ? "Restore" : "Maximize"}{" "}
            </a>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );

  onCompanyChange = (option) => {
    this.props.onCompanyChange(option.value);
  };

  initTable = () => {
    let tableResponsive = "#transporters-table";

    datatable = $(tableResponsive).DataTable({
      dom: "Bfrti",
      data: this.props.transporters,
      order: [[0, "asc"]],
      columns: [
        {
          data: "id",
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
      ],
      columnDefs: [
        {
          targets: [2],
          data: null,
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <div className="table-actions text-center">
                <Button
                  className="shadow-1 btn-rounded btn-icon btn-sm"
                  variant="outline-success"
                  onClick={() => this.onEditTransporter(rowData.id)}
                >
                  <i className="fa fa-edit f-14" />
                </Button>
                <Button
                  className="shadow-1 btn-rounded btn-icon btn-sm"
                  variant="outline-danger"
                  onClick={() => this.onRemoveTransporter(rowData.id)}
                >
                  <i className="fa fa-trash f-14" />
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
      buttons: [
        {
          extend: "csvHtml5",
          text: "CSV",
          title: "Suppliers",
          className: "btn btn-sm btn-outline-primary",
        },
        {
          extend: "print",
          text: "Print",
          title: "Suppliers",
          className: "btn btn-sm btn-outline-primary",
        },
      ],
    });
  };

  onAddTransporter = () => {
    this.props.history.push("/suppliers/add");
  };

  onEditTransporter = (transId) => {
    this.props.history.push("/suppliers/" + transId);
  };

  onRemoveTransporter = (transId) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this transporter!",
      type: "warning",
      showCloseButton: true,
      showCancelButton: true,
    }).then(async (willDelete) => {
      if (willDelete.value) {
        const response = await axios.post(
          this.props.apiDomain + "/transporters/delete/" + transId
        );
        if (response.data.status == 200) {
          this.props.setTransporters(response.data.result);
          PNotify.success({
            title: "Success",
            text: "The transporter has been deleted.",
          });
        }
      }
    });
  };

  render() {
    let fullScreenStyle;
    let cardClass = [];
    if (this.state.fullCard) {
      cardClass = [...cardClass, "full-card"];
      fullScreenStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: this.props.windowWidth,
        height: this.props.windowHeight,
      };
    }

    return (
      <Aux>
        <Row>
          <Col>
            <Card className={cardClass.join(" ")} style={fullScreenStyle}>
              <Card.Header>
                <Card.Title as="h5">Transporters</Card.Title>
                {this.cardHeaderRight}
              </Card.Header>
              <Card.Body>
                <Table
                  ref="tbl"
                  striped
                  hover
                  responsive
                  className="table table-condensed"
                  id="transporters-table"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Transporter</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>#</th>
                      <th>Transporter</th>
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
    transporters: state.transporters,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTransporters: (transporters) =>
      dispatch({
        type: actionTypes.TRANSPORTERS_SET,
        transporters: transporters,
      }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(windowSize(Suppliers))
);
