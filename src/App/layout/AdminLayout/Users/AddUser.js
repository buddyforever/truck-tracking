import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  ValidationForm,
  TextInput,
  SelectGroup,
  Checkbox,
} from "react-bootstrap4-form-validation";
import PNotify from "pnotify/dist/es/PNotify";
import NumberFormat from "react-number-format";
import validator from "validator";
import windowSize from "react-window-size";
import { connect } from "react-redux";

import Aux from "../../../../hoc/_Aux";
import * as actionTypes from "../../../../store/actions";
class AddUser extends React.Component {
  state = {
    firstname: "",
    lastname: "",
    email: "",
    companyId: this.props.authUser.type === 0 ? 0 : this.props.companyId,
    password: "",
    confirmPassword: "",
    phone: "",
    type: 1,
    status: 1,
  };

  async componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      const response = await axios.get(this.props.apiDomain + "/companies/get");
      const companies = response.data.result;
      this.props.setCompanies(companies);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleCheckboxChange = (e, value) => {
    this.setState({
      [e.target.name]: value,
    });
  };
  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e, formData, inputs) => {
    e.preventDefault();
    if (this.mounted) {
      const response = await axios.post(
        this.props.apiDomain + "/users/add",
        formData
      );
      if (response.data.status === 200) {
        PNotify.success({
          title: "Success",
          text: "The new user has been added.",
        });
        this.props.setUsers(response.data.result);
        let props = this.props;
        setTimeout(function() {
          props.history.push("/users");
        }, 2000);
      }
      //alert(JSON.stringify(formData, null, 2));
    }
  };

  handleErrorSubmit = (e, formData, errorInputs) => {
    //console.log(errorInputs);
  };

  matchPassword = (value) => {
    return value && value === this.state.password;
  };

  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Add New User</Card.Title>
              </Card.Header>
              <Card.Body>
                <ValidationForm
                  onSubmit={this.handleSubmit}
                  onErrorSubmit={this.handleErrorSubmit}
                >
                  <Form.Row>
                    <Form.Group as={Col} md="6">
                      <Form.Label htmlFor="firstName">First name</Form.Label>
                      <TextInput
                        name="firstname"
                        id="firstname"
                        placeholder="First Name"
                        required
                        value={this.state.firstname}
                        onChange={this.handleInputChange}
                        autoComplete="off"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label htmlFor="lastName">Last name</Form.Label>
                      <TextInput
                        name="lastname"
                        id="lastname"
                        placeholder="Last Name"
                        minLength="4"
                        value={this.state.lastname}
                        onChange={this.handleInputChange}
                        autoComplete="off"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label htmlFor="email">Email</Form.Label>
                      <TextInput
                        name="email"
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        validator={validator.isEmail}
                        errorMessage={{
                          validator: "Please enter a valid email",
                        }}
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        autoComplete="off"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label htmlFor="phone">Phone</Form.Label>
                      <NumberFormat
                        name="phone"
                        id="phone"
                        placeholder="Phone number"
                        className="form-control"
                        value={this.state.phone}
                        onChange={this.handleInputChange}
                        prefix="+243 "
                        format="+243 ### ### ###"
                        autoComplete="off"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label htmlFor="password">Password</Form.Label>
                      <TextInput
                        name="password"
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                        pattern="(?=.*[A-Z]).{6,}"
                        errorMessage={{
                          required: "Password is required",
                          pattern:
                            "Password should be at least 6 characters and contains at least one upper case letter",
                        }}
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        autoComplete="off"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label htmlFor="confirmPassword">
                        Confirm Password
                      </Form.Label>
                      <TextInput
                        name="confirmPassword"
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        required
                        validator={this.matchPassword}
                        errorMessage={{
                          required: "Confirm password is required",
                          validator: "Password does not match",
                        }}
                        value={this.state.confirmPassword}
                        onChange={this.handleInputChange}
                        autoComplete="off"
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                      <Form.Label htmlFor="companyId">Company</Form.Label>
                      <SelectGroup
                        name="companyId"
                        id="companyId"
                        value={this.state.companyId}
                        required
                        readOnly={this.props.authUser.type !== 0 ? true : false}
                        errorMessage="Please select a company."
                        onChange={this.handleInputChange}
                      >
                        <option value="">Please select a company...</option>
                        {this.props.companies.map((comp) => {
                          return (
                            <option value={comp.id} key={comp.id}>
                              {comp.companyName}
                            </option>
                          );
                        })}
                      </SelectGroup>
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                      <Form.Label htmlFor="type">Role</Form.Label>
                      <SelectGroup
                        name="type"
                        id="type"
                        value={this.state.type}
                        required
                        errorMessage="Please select a role."
                        onChange={this.handleInputChange}
                      >
                        <option value="">Please select a role...</option>
                        <option value="2">Loading</option>
                        <option value="3">Unloading</option>
                      </SelectGroup>
                    </Form.Group>

                    <Form.Group as={Col} sm="6" className="mb-5">
                      <Form.Label htmlFor="status">Status</Form.Label>
                      <div className="switch">
                        <Checkbox
                          name="status"
                          id="status"
                          value={this.state.status === 1}
                          inline
                          onChange={this.handleCheckboxChange}
                        />
                        <Form.Label>
                          {this.state.status ? "Active" : "Inactive"}
                        </Form.Label>
                      </div>
                    </Form.Group>

                    <Form.Group as={Col} sm={12} className="mt-3">
                      <Button type="submit">Submit</Button>
                    </Form.Group>
                  </Form.Row>
                </ValidationForm>
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
    companies: state.companies,
    apiDomain: state.apiDomain,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCompanies: (companies) =>
      dispatch({ type: actionTypes.COMPANIES_SET, companies: companies }),
    setUsers: (users) =>
      dispatch({ type: actionTypes.USERS_SET, users: users }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(windowSize(AddUser))
);
