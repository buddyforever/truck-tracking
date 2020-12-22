import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import {
  ValidationForm,
  BaseFormControl,
  TextInput,
  SelectGroup,
} from "react-bootstrap4-form-validation";
import MaskedInput from "react-text-mask";
import windowSize from "react-window-size";
import { connect } from "react-redux";
import InputMask from "react-input-mask";
import NumberFormat from "react-number-format";

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

class UnloadingDealDetail extends React.Component {
  state = {
    id: 0,
    driverName: "",
    driverPhone: "",
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
    startedDateTime: "",
    alertTime: "",
    finishedDateTime: "",
    borderNumber: "",
    receiptNumber: "",
    description: "",
    newDescription: "",
    status: 0,
  };

  componentDidMount() {
    const { dealId } = this.props.match.params;
    if (dealId > 0) {
      let deals = DEMO.deals.filter((d) => {
        return d.id == dealId;
      });
      this.setState({
        ...deals[0],
      });
    }
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e, formData, inputs) => {
    e.preventDefault();
    console.log(formData);
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
                <Card.Title as="h5">
                  {this.state.status == 1
                    ? "Loading"
                    : this.state.status == 2
                    ? "On route"
                    : this.state.status == 3
                    ? "Unloading"
                    : ""}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ValidationForm
                  onSubmit={this.handleSubmit}
                  onErrorSubmit={this.handleErrorSubmit}
                >
                  <TextInput type="hidden" name="id" value={this.state.id} />
                  <TextInput
                    type="hidden"
                    name="userId"
                    value={this.props.authUser.id}
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
                        <Form.Label htmlFor="startedDateTime">
                          Entry Date and Time
                        </Form.Label>
                        <TextInput
                          name="startedDateTime"
                          id="startedDateTime"
                          placeholder="Entry Date and Time"
                          readOnly
                          value={this.state.startedDateTime}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="email">Truck Plate</Form.Label>
                        <TextInput
                          name="truckPlate"
                          id="truckPlate"
                          placeholder="Truck Plate"
                          readOnly
                          value={this.state.truckPlate}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="email">Trailer Plate</Form.Label>
                        <TextInput
                          name="trailerPlate"
                          id="trailerPlate"
                          placeholder="Trailer Plate"
                          readOnly
                          value={this.state.trailerPlate}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="email">Second Plate</Form.Label>
                        <TextInput
                          name="secondPlate"
                          id="secondPlate"
                          placeholder="Second Plate"
                          value={this.state.secondPlate}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="transporterId">
                          Transporter
                        </Form.Label>
                        <SelectGroup
                          name="transporterId"
                          id="transporterId"
                          value={this.state.transporterId}
                          readOnly
                          disabled
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
                          readOnly
                          value={this.state.driverName}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="driverPhone">Phone</Form.Label>
                        <MaskWithValidation
                          name="driverPhone"
                          id="driverPhone"
                          placeholder="Phone number"
                          readOnly
                          className="form-control"
                          value={this.state.driverPhone}
                          successMessage="Looks good!"
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
                              thousandSeparator={true}
                              name="firstWeight"
                              id="firstWeight"
                              placeholder="First Weight"
                              onChange={this.handleInputChange}
                              autoComplete="off"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label htmlFor="secondWeight">
                              Second Weight
                            </Form.Label>
                            <NumberFormat
                              className="form-control"
                              thousandSeparator={true}
                              name="secondWeight"
                              id="secondWeight"
                              placeholder="Second Weight"
                              onChange={this.handleInputChange}
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
                      <Form.Group>
                        <Form.Label htmlFor="netWeight">Net Weight</Form.Label>
                        <NumberFormat
                          className="form-control"
                          thousandSeparator={true}
                          name="netWeight"
                          id="netWeight"
                          placeholder="Net Weight"
                          value={this.state.netWeight}
                          readOnly
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="newNetWeight">
                          New Net Weight
                        </Form.Label>
                        <NumberFormat
                          className="form-control"
                          thousandSeparator={true}
                          name="newNetWeight"
                          id="newNetWeight"
                          placeholder="New Net Weight"
                          value={this.state.newNetWeight}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="alertTime">Alert Time</Form.Label>
                        <SelectGroup
                          name="alertTime"
                          id="alertTime"
                          value={this.state.alertTime}
                          errorMessage="Transporter"
                          readOnly
                          disabled
                        >
                          <option value="">Alert Time</option>
                          <option>An hour</option>
                          <option>2 hours</option>
                          <option>4 hours/</option>
                          <option>8 hours</option>
                          <option>16 hours</option>
                        </SelectGroup>
                      </Form.Group>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <Form.Label htmlFor="alertTime">
                          Exit Date and Time
                        </Form.Label>
                        <InputMask
                          className="form-control"
                          mask="9999-99-99 99:99:99"
                          placeholder="YYYY-MM-DD hh:mm:ss"
                          id="finishedDateTime"
                          name="finishedDateTime"
                          value={this.state.finishedDateTime}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                        />
                      </Form.Group>
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
                          readOnly
                          value={this.state.description}
                          rows="3"
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>New Description</Form.Label>
                        <TextInput
                          name="newDescription"
                          id="newDescription"
                          placeholder="New Description"
                          multiline
                          value={this.state.newDescription}
                          onChange={this.handleInputChange}
                          rows="3"
                          autoComplete="off"
                        />
                      </Form.Group>
                    </Col>

                    <Form.Group as={Col} sm={12} className="mt-3">
                      <Button type="submit" variant="primary">
                        Save
                      </Button>
                      <Button type="submit" variant="danger">
                        Submit & Close
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
    authUser: state.authUser,
    companyId: state.companyId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(windowSize(UnloadingDealDetail))
);
