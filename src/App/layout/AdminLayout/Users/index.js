import React from "react";
import ReactDOM from "react-dom";
import { withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Table, Dropdown, Button } from "react-bootstrap";
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
let datatable;

class Users extends React.Component {
  state = {
    fullCard: false,
  };

  componentDidMount() {
    this.initTable();
  }

  componentDidUpdate() {
    let companyUsers = this.props.users.filter((u) => {
      return u.companyId == this.props.companyId;
    });
    datatable.clear();
    datatable.rows.add(companyUsers);
    datatable.draw();
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

  initTable = () => {
    let tableResponsive = "#users-table";

    datatable = $(tableResponsive).DataTable({
      data: this.props.users.filter((user) => {
        return user.companyId == this.props.companyId;
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
          data: "type",
          render: (data, type, row) => {
            return DEMO.companies.filter((comp) => {
              return comp.id == data;
            })[0].companyName;
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
    }).then((willDelete) => {
      if (willDelete.value) {
        this.props.onRemoveUser(userId);
        PNotify.success({
          title: "Success",
          text: "The user has been deleted.",
        });
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
    return (
      <Aux>
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
    authUser: state.authUser,
    companyId: state.companyId,
    users: state.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRemoveUser: (userId) =>
      dispatch({
        type: actionTypes.USER_REMOVE_POST,
        userId: userId,
      }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(windowSize(Users))
);
