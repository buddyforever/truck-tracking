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

class Users extends React.Component {
  state = {
    fullCard: false,
    current: this.props.companyId,
  };

  async componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      const response = await axios.get(this.props.apiDomain + `/users/get`);
      console.log(response);
      if (response.data.status === 200) {
        this.props.setUsers(response.data.result);
        this.initTable();
      }

      const companies_response = await axios.get(
        this.props.apiDomain + `/companies/get`
      );
      if (companies_response.data.status === 200) {
        this.props.setCompanies(companies_response.data.result);
      }
    }
  }

  componentDidUpdate() {
    if (this.mounted) {
      let companyUsers = this.props.users.filter((u) => {
        return (
          (u.companyId === this.props.companyId && u.type !== 1) ||
          this.props.companyId === 0
        );
      });
      if (datatable) {
        datatable.clear();
        datatable.rows.add(companyUsers);
        datatable.draw();
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  cardHeaderRight = (
    <div className="card-header-right">
      <Dropdown alignRight={true} className="btn-group card-option">
        <Dropdown.Toggle id="dropdown-basic" className="btn-icon">
          <i className="feather icon-more-horizontal" />
        </Dropdown.Toggle>
        <Dropdown.Menu as="ul" className="list-unstyled card-option">
          <Dropdown.Item as="li" className="dropdown-item">
            <i className="feather icon-user" />
            <Link to="/users/add"> Add a user </Link>
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
    let tableResponsive = "#users-table";

    datatable = $(tableResponsive).DataTable({
      dom: "Bfrti",
      data: this.props.users.filter((user) => {
        return (
          (user.companyId === this.props.companyId && user.type !== 1) ||
          this.props.companyId === 0
        );
      }),
      order: [[0, "asc"]],
      columns: [
        {
          data: "id",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "firstname",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "lastname",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "email",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "companyName",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "type",
          render: (data, type, row) => {
            return data === 1
              ? "Admin"
              : data === 2
              ? "Loading"
              : data === 3
              ? "Unloading"
              : "";
          },
        },
      ],
      columnDefs: [
        {
          targets: [6],
          data: null,
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <div className="table-actions text-center">
                <Button
                  className="shadow-1 btn-rounded btn-icon btn-sm"
                  variant="outline-success"
                  onClick={() => this.onEditUser(rowData.id)}
                >
                  <i className="fa fa-edit f-14" />
                </Button>
                <Button
                  className="shadow-1 btn-rounded btn-icon btn-sm"
                  variant="outline-danger"
                  onClick={() => this.onRemoveUser(rowData.id)}
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
          title: "Users",
          className: "btn btn-sm btn-outline-primary",
        },
        {
          extend: "print",
          text: "Print",
          title: "Users",
          className: "btn btn-sm btn-outline-primary",
        },
      ],
    });
  };

  onAddUser = () => {
    this.props.history.push("/users/add");
  };

  onEditUser = (userId) => {
    this.props.history.push("/users/" + userId);
  };

  onRemoveUser = (userId) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      type: "warning",
      showCloseButton: true,
      showCancelButton: true,
    }).then(async (willDelete) => {
      if (willDelete.value) {
        const response = await axios.post(
          this.props.apiDomain + "/users/delete/" + userId
        );
        if (response.data.status === 200) {
          this.props.setUsers(response.data.result);
          PNotify.success({
            title: "Success",
            text: "The user has been deleted.",
          });
        }
        //eturn MySwal.fire("", "The user has been deleted!", "success");
      } else {
        //return MySwal.fire("", "This user is safe!", "error");
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
    let companyOptions = [{ value: 0, label: "All" }];
    this.props.companies.forEach((comp) => {
      companyOptions.push({
        value: comp.id,
        label: comp.companyName,
      });
    });
    let currentCompanyOption = companyOptions.filter(
      (comp) => comp.value === this.props.companyId
    );

    return (
      <Aux>
        <Row className="mb-4">
          <Col md={{ span: 4, offset: 8 }} xl={{ span: 3, offset: 9 }}>
            <div className="d-flex align-items-center justify-content-end">
              {this.props.authUser.type === 0 ? (
                <Select
                  className="basic-single w-100 m-r-10"
                  classNamePrefix="select"
                  value={
                    this.props.companyId !== 0
                      ? currentCompanyOption[0]
                      : companyOptions[0]
                  }
                  onChange={this.onCompanyChange}
                  name="company"
                  options={companyOptions}
                />
              ) : (
                <></>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className={cardClass.join(" ")} style={fullScreenStyle}>
              <Card.Header>
                <Card.Title as="h5">
                  <i className="feather icon-users" /> Users
                </Card.Title>
                {this.cardHeaderRight}
              </Card.Header>
              <Card.Body>
                <Table
                  ref="tbl"
                  striped
                  hover
                  responsive
                  className="table table-condensed"
                  id="users-table"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Company</th>
                      <th>Role</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Company</th>
                      <th>Role</th>
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
    users: state.users,
    companies: state.companies,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUsers: (users) =>
      dispatch({ type: actionTypes.USERS_SET, users: users }),
    setCompanies: (companies) =>
      dispatch({ type: actionTypes.COMPANIES_SET, companies: companies }),
    onCompanyChange: (companyId) =>
      dispatch({ type: actionTypes.COMPANY_CHANGE, companyId: companyId }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(windowSize(Users))
);
