import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  ValidationForm,
  BaseFormControl,
  TextInput,
  SelectGroup,
  Checkbox,
} from "react-bootstrap4-form-validation";
import PNotify from "pnotify/dist/es/PNotify";
import MaskedInput from "react-text-mask";
import validator from "validator";
import windowSize from "react-window-size";
import { connect } from "react-redux";

import Aux from "../../../../hoc/_Aux";
import * as actionTypes from "../../../../store/actions";

class MaskWithValidation extends BaseFormControl {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  getInputRef() {
    return this.inputRef.current.inputElement;
  }

  handleInputChange = (e) => {
    this.checkError();
    if (this.props.onChange) this.props.onChange(e);
  };

  render() {
    return (
      <React.Fragment>
        <MaskedInput
          ref={this.inputRef}
          {...this.filterProps()}
          onChange={this.handleInputChange}
        />
        {this.displayErrorMessage()}
        {this.displaySuccessMessage()}
      </React.Fragment>
    );
  }
}

class EditUser extends React.Component {
  state = {
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    companyId: 0,
    password: "",
    confirmPassword: "",
    phone: "",
    type: 1,
    status: 1,
  };

  async componentDidMount() {
    this.mounted = true;
    const { id } = this.props.match.params;
    if (id > 0) {
      if (this.mounted) {
        const response = await axios.get(this.props.apiDomain + "/users/" + id);
        if (response.data.status === 200) {
          this.setState({
            ...response.data.result[0],
          });
        }
        const company_response = await axios.get(
          this.props.apiDomain + "/companies/get"
        );
        const companies = company_response.data.result;
        this.props.setCompanies(companies);
      }
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
        this.props.apiDomain + "/users/update",
        formData
      );
      if (response.data.status === 200) {
        this.props.setUsers(response.data.result);
        PNotify.success({
          title: "Success",
          text: "The user detail has been updated.",
        });
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
                <Card.Title as="h5">
                  {this.state.id > 0 ? "Edit" : "Add New"} User
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ValidationForm
                  onSubmit={this.handleSubmit}
                  onErrorSubmit={this.handleErrorSubmit}
                >
                  <TextInput type="hidden" name="id" value={this.state.id} />
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
                      <MaskWithValidation
                        name="phone"
                        id="phone"
                        placeholder="Contact Number"
                        className="form-control"
                        required
                        value={this.state.phone}
                        onChange={this.handleInputChange}
                        successMessage="Looks good!"
                        errorMessage={{
                          validator: "Please enter (123) 456-7890",
                        }}
                        mask={[
                          "(",
                          /[1-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          ")",
                          " ",
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          "-",
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                        ]}
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
    apiDomain: state.apiDomain,
    authUser: state.authUser,
    companyId: state.companyId,
    companies: state.companies,
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
  )(windowSize(EditUser))
);
