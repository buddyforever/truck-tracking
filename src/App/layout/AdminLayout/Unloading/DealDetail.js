import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  ValidationForm,
  TextInput,
  SelectGroup,
} from "react-bootstrap4-form-validation";
import windowSize from "react-window-size";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import PNotify from "pnotify/dist/es/PNotify";

import Aux from "../../../../hoc/_Aux";
import * as actionTypes from "../../../../store/actions";

const padLeft = function(num) {
  return num >= 10 ? num : "0" + num;
};

const formatDateTime = function(timestamp) {
  let dformat = "";
  if (timestamp) {
    var d = new Date(timestamp);
    dformat =
      [d.getFullYear(), padLeft(d.getMonth() + 1), padLeft(d.getDate())].join(
        "-"
      ) +
      " " +
      [
        padLeft(d.getHours()),
        padLeft(d.getMinutes()),
        padLeft(d.getSeconds()),
      ].join(":");
  }
  return dformat;
};
class UnloadingDealDetail extends React.Component {
  state = {
    id: 0,
    userId: this.props.authUser.id,
    companyId: this.props.companyId,
    driverName: "",
    driverPhone: "",
    truckPlate: "",
    trailerPlate: "",
    secondPlate: "",
    transporterId: 0,
    productId: 0, //weight based
    firstWeight: 0,
    secondWeight: 0,
    netWeight: 0,
    newFirstWeight: 0,
    newSecondWeight: 0,
    newNetWeight: 0,
    quantity: 0,
    newQuantity: 0,
    alertTime: 0,
    borderNumber: 0,
    receiptNumber: 0,
    description: "",
    newDescription: "",
    startLoadingAt: "",
    finishLoadingAt: "",
    startUnloadingAt: "",
    finishUnloadingAt: "",
    status: 0,
    submitted: 0,
  };

  async componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      const response1 = await axios.get(
        this.props.apiDomain + "/transporters/get"
      );
      if (response1.data.status === 200) {
        this.props.setTransporters(response1.data.result);
      }
      const response2 = await axios.get(this.props.apiDomain + "/products/get");
      if (response2.data.status === 200) {
        this.props.setProducts(response2.data.result);
      }
      const { dealId } = this.props.match.params;
      if (dealId > 0) {
        const response3 = await axios.get(
          this.props.apiDomain + "/deals/get/" + dealId
        );
        if (response3.data.status === 200) {
          if (this.mounted) {
            this.setState({
              ...response3.data.result[0],
              startLoadingAt: formatDateTime(
                response3.data.result[0].startLoadingAt
              ),
              finishLoadingAt: formatDateTime(
                response3.data.result[0].finishLoadingAt
              ),
              startUnloadingAt: formatDateTime(
                response3.data.result[0].startUnloadingAt
              ),
              finishUnloadingAt: formatDateTime(
                response3.data.result[0].finishUnloadingAt
              ),
            });
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSaveForm = () => {
    this.setState({ status: 3, submitted: 0 }, async function() {
      const response = await axios.post(
        this.props.apiDomain + "/deals/update",
        this.state
      );
      if (response.data.status === 200) {
        PNotify.success({
          title: "Success",
          text: "The loading detail has been updated.",
        });
        this.props.setDeals(response.data.result);
      }
    });
  };

  handleSubmit = (e, formData, inputs) => {
    e.preventDefault();
    this.setState(
      {
        firstWeight: this.state.secondWeight,
        finishUnloadingAt: formatDateTime(new Date()),
        status: 4,
        submitted: 1,
      },
      async function() {
        const response = await axios.post(
          this.props.apiDomain + "/deals/update",
          this.state
        );
        if (response.data.status === 200) {
          PNotify.success({
            title: "Success",
            text: "Unloading has been finished.",
          });
          this.props.setDeals(response.data.result);
          let props = this.props;
          setTimeout(function() {
            props.history.push("/unloading");
          }, 2000);
        }
      }
    );
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
                  {this.state.status === 1
                    ? "Loading"
                    : this.state.status === 2
                    ? "On route"
                    : this.state.status === 3
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
                    value={this.state.userId}
                  />
                  <TextInput
                    type="hidden"
                    name="companyId"
                    value={this.state.companyId}
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
                        <Form.Label htmlFor="startUnloadingAt">
                          Entry Date and Time
                        </Form.Label>
                        <TextInput
                          name="startUnloadingAt"
                          id="startUnloadingAt"
                          placeholder="Entry Date and Time"
                          readOnly
                          value={this.state.startUnloadingAt}
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
                          required
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
                          required
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
                          readOnly={
                            this.props.authUser.type === 3 ? false : true
                          }
                          required
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
                          required
                          disabled
                        >
                          <option value="">Transporter</option>
                          {this.props.transporters.map((trans) => {
                            return (
                              <option value={trans.id} key={trans.id}>
                                {trans.transporter}
                              </option>
                            );
                          })}
                        </SelectGroup>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="driverName">Driver</Form.Label>
                        <TextInput
                          name="driverName"
                          id="driverName"
                          placeholder="Driver"
                          readOnly
                          required
                          value={this.state.driverName}
                          autoComplete="off"
                        />
                      </Form.Group>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <Form.Label htmlFor="driverPhone">Phone</Form.Label>
                        <NumberFormat
                          name="driverPhone"
                          id="driverPhone"
                          placeholder="Phone number"
                          readOnly={
                            this.state.status === 1 &&
                            this.props.authUser.type === 2
                              ? false
                              : true
                          }
                          required
                          className="form-control"
                          value={this.state.driverPhone}
                          onChange={this.handleInputChange}
                          prefix="+243 "
                          format="+243 ### ### ###"
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="productId">Product</Form.Label>
                        <SelectGroup
                          name="productId"
                          id="productId"
                          value={this.state.productId}
                          errorMessage="Transporter"
                          disabled
                          required
                        >
                          <option value="">Select Product</option>
                          {this.props.products
                            .filter(
                              (item) => item.companyId === this.props.companyId
                            )
                            .map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.productName}
                                </option>
                              );
                            })}
                          <option value="-1">Truck</option>
                        </SelectGroup>
                      </Form.Group>
                      {this.props.companyId === 1 ? (
                        <>
                          <Form.Group>
                            <Form.Label htmlFor="firstWeight">
                              First Weight
                            </Form.Label>
                            <TextInput
                              className="form-control"
                              name="firstWeight"
                              id="firstWeight"
                              readOnly
                              placeholder="First Weight"
                              value={this.state.firstWeight}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label htmlFor="secondWeight">
                              Second Weight
                            </Form.Label>
                            <TextInput
                              className="form-control"
                              name="secondWeight"
                              id="secondWeight"
                              readOnly
                              placeholder="Second Weight"
                              value={this.state.secondWeight}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label htmlFor="netWeight">
                              Net Weight
                            </Form.Label>
                            <TextInput
                              className="form-control"
                              name="netWeight"
                              id="netWeight"
                              readOnly
                              placeholder="Net Weight"
                              value={this.state.netWeight}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label htmlFor="newFirstWeight">
                              New First Weight
                            </Form.Label>
                            <NumberFormat
                              className="form-control"
                              name="newFirstWeight"
                              id="newFirstWeight"
                              placeholder="New First Weight"
                              readOnly={
                                this.props.authUser.type === 3 ? false : true
                              }
                              required
                              value={this.state.newFirstWeight}
                              onChange={(e) => {
                                this.setState({
                                  newFirstWeight: e.target.value,
                                  newNetWeight:
                                    e.target.value - this.state.newSecondWeight,
                                });
                              }}
                              autoComplete="off"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label htmlFor="newSecondWeight">
                              New Second Weight
                            </Form.Label>
                            <NumberFormat
                              className="form-control"
                              name="newSecondWeight"
                              id="newSecondWeight"
                              placeholder="New Second Weight"
                              readOnly={
                                this.props.authUser.type === 3 ? false : true
                              }
                              required
                              value={this.state.newSecondWeight}
                              onChange={(e) => {
                                this.setState({
                                  newSecondWeight: e.target.value,
                                  newNetWeight:
                                    this.state.newFirstWeight - e.target.value,
                                });
                              }}
                              autoComplete="off"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label htmlFor="newNetWeight">
                              New Net Weight
                            </Form.Label>
                            <NumberFormat
                              className="form-control"
                              name="newNetWeight"
                              id="newNetWeight"
                              placeholder="New Net Weight"
                              readOnly={
                                this.props.authUser.type === 3 ? false : true
                              }
                              required
                              value={this.state.newNetWeight}
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
                          <TextInput
                            type="hidden"
                            name="netWeight"
                            value={this.state.netWeight}
                          />
                          <TextInput
                            type="hidden"
                            name="newNetWeight"
                            value={this.state.newNetWeight}
                          />
                        </>
                      )}
                      {this.props.companyId === 1 ? (
                        <>
                          <TextInput
                            type="hidden"
                            name="quantity"
                            value={this.state.quantity}
                          />
                          <TextInput
                            type="hidden"
                            name="newQuantity"
                            value={this.state.newQuantity}
                          />
                        </>
                      ) : (
                        <>
                          <Form.Group>
                            <Form.Label htmlFor="quantity">Quantity</Form.Label>
                            <TextInput
                              className="form-control"
                              name="quantity"
                              id="quantity"
                              readOnly
                              placeholder="Quantity"
                              value={this.state.quantity}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label htmlFor="newQuantity">
                              New Quantity
                            </Form.Label>
                            <NumberFormat
                              className="form-control"
                              name="newQuantity"
                              id="newQuantity"
                              placeholder="New Quantity"
                              readOnly={
                                this.props.authUser.type === 3 ? false : true
                              }
                              required
                              value={this.state.newQuantity}
                              onChange={this.handleInputChange}
                              autoComplete="off"
                            />
                          </Form.Group>
                        </>
                      )}
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <Form.Label htmlFor="alertTime">Alert Time</Form.Label>
                        <SelectGroup
                          name="alertTime"
                          id="alertTime"
                          value={this.state.alertTime}
                          errorMessage="Transporter"
                          disabled
                          required
                        >
                          <option>Alert Time</option>
                          <option value="60">An hour</option>
                          <option value="120">2 hours</option>
                          <option value="240">4 hours</option>
                          <option value="480">8 hours</option>
                          <option value="960">16 hours</option>
                        </SelectGroup>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="finishUnloadingAt">
                          Exit Date and Time
                        </Form.Label>
                        <TextInput
                          name="finishUnloadingAt"
                          id="finishUnloadingAt"
                          readOnly
                          required
                          placeholder="Exit Date and Time"
                          value={this.state.finishUnloadingAt}
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
                          readOnly
                          required
                          id="borderNumber"
                          name="borderNumber"
                          value={this.state.borderNumber}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label htmlFor="borderNumber">
                          Bon de Livraison
                        </Form.Label>
                        <NumberFormat
                          className="form-control"
                          placeholder="Bon de Livraison"
                          readOnly
                          required
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
                          required
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
                          readOnly={
                            this.props.authUser.type === 3 ? false : true
                          }
                          required
                          multiline
                          value={this.state.newDescription}
                          onChange={this.handleInputChange}
                          rows="3"
                          autoComplete="off"
                        />
                      </Form.Group>
                    </Col>

                    {this.state.id && this.props.authUser.type === 3 ? (
                      <Form.Group as={Col} sm={12} className="mt-3">
                        <Button
                          type="button"
                          variant="primary"
                          onClick={this.onSaveForm}
                        >
                          Save
                        </Button>
                        <Button type="submit" variant="danger">
                          Submit & Close
                        </Button>
                      </Form.Group>
                    ) : (
                      <></>
                    )}
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
    products: state.products,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDeals: (deals) =>
      dispatch({ type: actionTypes.DEALS_SET, deals: deals }),
    setTransporters: (transporters) =>
      dispatch({
        type: actionTypes.TRANSPORTERS_SET,
        transporters: transporters,
      }),
    setProducts: (products) =>
      dispatch({
        type: actionTypes.PRODUCTS_SET,
        products: products,
      }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(windowSize(UnloadingDealDetail))
);
