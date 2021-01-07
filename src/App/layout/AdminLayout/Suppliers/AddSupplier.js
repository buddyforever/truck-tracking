import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { ValidationForm, TextInput } from "react-bootstrap4-form-validation";
import PNotify from "pnotify/dist/es/PNotify";
import windowSize from "react-window-size";
import { connect } from "react-redux";

import Aux from "../../../../hoc/_Aux";
import * as actionTypes from "../../../../store/actions";

class AddSupplier extends React.Component {
  state = {
    transporter: "",
  };

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e, formData, inputs) => {
    e.preventDefault();
    const response = await axios.post(
      this.props.apiDomain + "/transporters/add",
      formData
    );
    if (response.data.status === 200) {
      PNotify.success({
        title: "Success",
        text: "The new transporter has been added.",
      });
      this.props.setTransporters(response.data.result);
      let props = this.props;
      setTimeout(function() {
        props.history.push("/suppliers");
      }, 2000);
    }
    //alert(JSON.stringify(formData, null, 2));
  };

  handleErrorSubmit = (e, formData, errorInputs) => {
    //console.log(errorInputs);
  };

  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Add New Transporter</Card.Title>
              </Card.Header>
              <Card.Body>
                <ValidationForm
                  onSubmit={this.handleSubmit}
                  onErrorSubmit={this.handleErrorSubmit}
                >
                  <Form.Row>
                    <Form.Group as={Col} md="6">
                      <Form.Label htmlFor="transporter">Transporter</Form.Label>
                      <TextInput
                        name="transporter"
                        id="transporter"
                        placeholder="Transporter"
                        required
                        value={this.state.transporter}
                        onChange={this.handleInputChange}
                        autoComplete="off"
                      />
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
  )(windowSize(AddSupplier))
);
