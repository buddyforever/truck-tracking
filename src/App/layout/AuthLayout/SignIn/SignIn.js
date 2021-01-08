import React from "react";
import { Redirect, withRouter } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ValidationForm, TextInput } from "react-bootstrap4-form-validation";
import { connect } from "react-redux";
import validator from "validator";
import publicIp from "public-ip";

import "./../../../../assets/scss/style.scss";
import Aux from "../../../../hoc/_Aux";
import Breadcrumb from "../../AdminLayout/Breadcrumb";
import * as actionTypes from "../../../../store/actions";
import axios from "axios";

class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    msg: "",
  };
  onEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  onPasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  onKeyPressed = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  };
  handleSubmit = async (e, formData, inputs) => {
    e.preventDefault();
    const clientIp = await publicIp.v4();
    const response = await axios.post(this.props.apiDomain + "/auth/signin", {
      email: this.state.email,
      password: this.state.password,
      ip_address: clientIp,
    });
    if (response.data.status === 200) {
      this.props.setAuthUser(response.data.result[0]);
    } else {
      this.setState({
        msg: "Email or password is incorrect. Please try again!",
      });
    }
  };
  handleErrorSubmit = (e, formData, errorInputs) => {
    //console.log(errorInputs);
  };
  render() {
    return !this.props.authUser ? (
      <Aux>
        <Breadcrumb />
        <div className="auth-wrapper">
          <div className="auth-content">
            <div className="auth-bg">
              <span className="r" />
              <span className="r s" />
              <span className="r s" />
              <span className="r" />
            </div>
            <div className="card">
              <div className="card-body">
                <div className="card-body-top text-center">
                  <div className="mb-4">
                    <i className="feather icon-unlock auth-icon" />
                  </div>
                  <h3 className="mb-4">Login</h3>
                  <div className="input-group mb-3">
                    <p className="text-c-red">{this.state.msg}</p>
                  </div>
                </div>
                <ValidationForm
                  onSubmit={(e) => this.handleSubmit(e)}
                  onErrorSubmit={this.handleErrorSubmit}
                >
                  <Form.Row>
                    <Form.Group as={Col} md="12">
                      <TextInput
                        required
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        validator={validator.isEmail}
                        errorMessage={{
                          validator: "Please enter a valid email",
                        }}
                        value={this.state.email}
                        onChange={this.onEmailChange}
                        onKeyDown={this.onKeyPressed}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                      <TextInput
                        required
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.onPasswordChange}
                        onKeyDown={this.onKeyPressed}
                      />
                    </Form.Group>
                    <Form.Group className="text-center mt-4" as={Col} md="12">
                      <Button type="submit">Login</Button>
                    </Form.Group>
                  </Form.Row>
                </ValidationForm>
              </div>
            </div>
          </div>
        </div>
      </Aux>
    ) : (
      <Redirect to="/dashboard" />
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
  return {
    setAuthUser: (authUser) =>
      dispatch({
        type: actionTypes.AUTH_USER_SET,
        authUser: authUser,
      }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignIn)
);
