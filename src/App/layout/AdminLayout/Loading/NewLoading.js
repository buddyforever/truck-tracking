import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import {
  ValidationForm,
  BaseFormControl,
  TextInput,
  SelectGroup,
} from "react-bootstrap4-form-validation";
import MaskedInput from "react-text-mask";
import validator from "validator";
import windowSize from "react-window-size";
import { connect } from "react-redux";
import InputMask from "react-input-mask";
import NumberFormat from "react-number-format";
import PNotify from "pnotify/dist/es/PNotify";

import Aux from "../../../../hoc/_Aux";
import DEMO from "../../../../store/constant";
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

class LoadingDealDetail extends React.Component {
  state = {
    userId: this.props.authUser.id,
    driverName: "",
    driverPhone: "",
    companyId: this.props.companyId,
    truckPlate: "",
    trailerPlate: "",
    secondPlate: "",
    transporterId: 0,
    productType: 0, //weight based
    firstWeight: 0,
    secondWeight: 0,
    netWeight: 0,
    newNetWeight: 0,
    quantity: 0,
    newQuantity: 0,
    startDateTime: "",
    alertTime: 0,
    finishDateTime: "",
    borderNumber: 0,
    receiptNumber: 0,
    description: "",
    newDescription: "",
    status: 0,
  };

  componentDidMount() {
    var dt = new Date();
    var now =
      dt.getFullYear() +
      "-" +
      (dt.getMonth() + 1) +
      "-" +
      dt.getDate() +
      " " +
      dt.getHours() +
      ":" +
      dt.getMinutes() +
      ":" +
      dt.getSeconds();
    console.log(now);
    this.setState({ startDateTime: now });
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e, formData, inputs) => {
    e.preventDefault();
    const response = await axios.post(
      this.props.apiDomain + "/deals/add",
      this.state
    );
    if (response.data.status == 200) {
      PNotify.success({
        title: "Success",
        text: "The new truck is ready to load.",
      });
      this.props.setDeals(response.data.result);
      let props = this.props;
      setTimeout(function() {
        props.history.push("/loading");
      }, 2000);
    }
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
                <Card.Title as="h5">Loading</Card.Title>
              </Card.Header>
              <Card.Body>
                <ValidationForm
                  onSubmit={this.handleSubmit}
                  onErrorSubmit={this.handleErrorSubmit}
                >
                  <TextInput
                    type="hidden"
                    name="companyId"
                    value={this.state.companyId}
                  />
                  <TextInput
                    type="hidden"
                    name="userId"
                    value={this.state.userId}
                  />
                  <Form.Row>
                    <Col md="4">
                      <Form.Group>
                        <Form.Label htmlFor="username">Username</Form.Label>
                        <TextInput
                          id="username"
                          placeholder="Username"
                          name="username"
                          readOnly
                          value={
                            this.props.authUser.firstname +
                            " " +
                            this.props.authUser.lastname
                          }
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="startDateTime">
                          Entry Date and Time
                        </Form.Label>
                        <InputMask
                          className="form-control"
                          mask="9999-99-99 99:99:99"
                          placeholder="yyyy-mm-dd hh:mm:ss"
                          value={this.state.startDateTime}
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="email">Truck Plate</Form.Label>
                        <TextInput
                          name="truckPlate"
                          id="truckPlate"
                          placeholder="Truck Plate"
                          value={this.state.truckPlate}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="email">Trailer Plate</Form.Label>
                        <TextInput
                          name="trailerPlate"
                          id="trailerPlate"
                          placeholder="Trailer Plate"
                          value={this.state.trailerPlate}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <TextInput
                        type="hidden"
                        name="secondPlate"
                        value={this.state.secondPlate}
                      />
                      <Form.Group>
                        <Form.Label htmlFor="transporterId">
                          Transporter
                        </Form.Label>
                        <SelectGroup
                          name="transporterId"
                          id="transporterId"
                          value={this.state.transporterId}
                          errorMessage="Transporter"
                          onChange={this.handleInputChange}
                        >
                          <option value="">Transporter</option>
                          {DEMO.transporters.map((trans) => {
                            return (
                              <option value={trans.id} key={trans.id}>
                                {trans.transporter}
                              </option>
                            );
                          })}
                        </SelectGroup>
                      </Form.Group>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <Form.Label htmlFor="driverName">Driver</Form.Label>
                        <TextInput
                          name="driverName"
                          id="driverName"
                          placeholder="Driver"
                          value={this.state.driverName}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="driverPhone">Phone</Form.Label>
                        <MaskWithValidation
                          name="driverPhone"
                          id="driverPhone"
                          placeholder="Phone number"
                          className="form-control"
                          value={this.state.driverPhone}
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
                      {this.props.companyId == 1 ? (
                        <>
                          <Form.Group>
                            <Form.Label htmlFor="firstWeight">
                              First Weight
                            </Form.Label>
                            <NumberFormat
                              className="form-control"
                              name="firstWeight"
                              id="firstWeight"
                              placeholder="First Weight"
                              value={this.state.firstWeight}
                              onChange={(e) => {
                                this.handleInputChange(e);
                                this.setState({
                                  netWeight:
                                    this.state.secondWeight - e.target.value,
                                });
                              }}
                              autoComplete="off"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label htmlFor="secondWeight">
                              Second Weight
                            </Form.Label>
                            <NumberFormat
                              className="form-control"
                              name="secondWeight"
                              id="secondWeight"
                              placeholder="Second Weight"
                              value={this.state.secondWeight}
                              onChange={(e) => {
                                this.handleInputChange(e);
                                this.setState({
                                  netWeight:
                                    e.target.value - this.state.firstWeight,
                                });
                              }}
                              autoComplete="off"
                            />
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <TextInput
                            type="hidden"
                            name="firstWeight"
                            value={this.state.firstWeight}
                          />
                          <TextInput
                            type="hidden"
                            name="secondWeight"
                            value={this.state.secondWeight}
                          />
                          <TextInput
                            type="hidden"
                            name="netWeight"
                            value={this.state.netWeight}
                          />
                        </>
                      )}
                      {this.props.companyId == 1 ? (
                        <TextInput
                          type="hidden"
                          name="quantity"
                          value={this.state.quantity}
                        />
                      ) : (
                        <Form.Group>
                          <Form.Label htmlFor="quantity">Quantity</Form.Label>
                          <NumberFormat
                            className="form-control"
                            thousandSeparator={true}
                            name="quantity"
                            id="quantity"
                            placeholder="Quantity"
                            value={this.state.quantity}
                            onChange={this.handleInputChange}
                            autoComplete="off"
                          />
                        </Form.Group>
                      )}
                      <TextInput
                        type="hidden"
                        name="netWeight"
                        value={this.state.netWeight}
                      />
                      <TextInput
                        type="hidden"
                        name="newQuantity"
                        value={this.state.newQuantity}
                      />
                      <Form.Group>
                        <Form.Label htmlFor="alertTime">Alert Time</Form.Label>
                        <SelectGroup
                          name="alertTime"
                          id="alertTime"
                          value={this.state.alertTime}
                          errorMessage="Transporter"
                          onChange={this.handleInputChange}
                        >
                          <option value="0">Alert Time</option>
                          <option value="60">An hour</option>
                          <option value="120">2 hours</option>
                          <option value="240">4 hours</option>
                          <option value="480">8 hours</option>
                          <option value="960">16 hours</option>
                        </SelectGroup>
                      </Form.Group>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <Form.Label htmlFor="borderNumber">
                          No de Bordereau
                        </Form.Label>
                        <NumberFormat
                          className="form-control"
                          placeholder="No de Bordereau"
                          id="borderNumber"
                          name="borderNumber"
                          value={this.state.borderNumber}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="borderNumber">
                          Ben de Livraison
                        </Form.Label>
                        <NumberFormat
                          className="form-control"
                          placeholder="Ben de Livraison"
                          id="receiptNumber"
                          name="receiptNumber"
                          value={this.state.receiptNumber}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <TextInput
                          name="description"
                          id="description"
                          placeholder="Description"
                          multiline
                          value={this.state.description}
                          onChange={this.handleInputChange}
                          rows="5"
                          autoComplete="off"
                        />
                      </Form.Group>
                      <TextInput
                        type="hidden"
                        name="newDescription"
                        value={this.state.newDescription}
                      />
                    </Col>

                    <Form.Group as={Col} sm={12} className="mt-3">
                      <Button type="submit" variant="primary">
                        Start loading
                      </Button>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDeals: (deals) =>
      dispatch({ type: actionTypes.DEALS_SET, deals: deals }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(windowSize(LoadingDealDetail))
);
