import React from "react";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
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
      this.onSignInPost();
    }
  };
  onSignInPost = async () => {
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
              <div className="card-body text-center">
                <div className="mb-4">
                  <i className="feather icon-unlock auth-icon" />
                </div>
                <h3 className="mb-4">Login</h3>
                <div className="input-group mb-3">
                  <p className="text-c-red">{this.state.msg}</p>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onEmailChange}
                    onKeyDown={this.onKeyPressed}
                    required
                  />
                </div>
                <div className="input-group mb-4">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.onPasswordChange}
                    onKeyDown={this.onKeyPressed}
                    required
                  />
                </div>
                <div className="form-group text-left">
                  <div className="checkbox checkbox-fill d-inline">
                    <input
                      type="checkbox"
                      name="checkbox-fill-1"
                      id="checkbox-fill-a1"
                    />
                    <label htmlFor="checkbox-fill-a1" className="cr">
                      Save credentials
                    </label>
                  </div>
                </div>
                <button
                  className="btn btn-primary shadow-2 mb-4"
                  onClick={this.onSignInPost}
                >
                  Login
                </button>
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
