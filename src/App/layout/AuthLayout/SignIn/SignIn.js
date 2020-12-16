import React from "react";
import { NavLink, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "./../../../../assets/scss/style.scss";
import Aux from "../../../../hoc/_Aux";
import Breadcrumb from "../../AdminLayout/Breadcrumb";
import * as actionTypes from "../../../../store/actions";
import DEMO from "../../../../store/constant";

class SignIn extends React.Component {
  state = {
    company: "",
    email: "",
    password: "",
  };
  onCompanyChange = (e) => {
    console.log(e.target.value);
    this.setState({
      company: e.target.value,
    });
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
  onSignInPost = () => {
    this.props.onSignInPost(this.state);
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
                  <select
                    className="form-control"
                    value={this.state.company}
                    onChange={this.onCompanyChange}
                    required
                  >
                    <option value="" disabled>
                      Select company
                    </option>
                    {DEMO.companies.map((comp) => {
                      return (
                        <option value={comp.id} key={comp.id}>
                          {comp.companyName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onEmailChange}
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
                <p className="mb-2 text-muted">
                  Forgot password?{" "}
                  <NavLink to="/auth/reset-password-1">Reset</NavLink>
                </p>
                <p className="mb-0 text-muted">
                  Don’t have an account?{" "}
                  <NavLink to="/auth/signup-1">Signup</NavLink>
                </p>
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
    authUser: state.authUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignInPost: (authUser) =>
      dispatch({
        type: actionTypes.AUTH_SIGNIN_POST,
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
