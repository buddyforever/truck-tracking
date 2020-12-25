import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import { Card } from "react-bootstrap";
import Select from "react-select";
import { HorizontalBar } from "react-chartjs-2";

import Aux from "../../../../../hoc/_Aux";

class AverageDeliveryTime extends React.Component {
  state = {
    reportData: [],
    unit: "hour",
  };
  async componentDidMount() {
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const response = await axios.get(
      this.props.apiDomain + "/report/getMonthlyDeliveryTime/" + companyId
    );
    if (response.data.status == 200) {
      this.setState({ reportData: response.data.result });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.companyId != this.props.companyId) {
      let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
      const response = await axios.get(
        this.props.apiDomain + "/report/getMonthlyDeliveryTime/" + companyId
      );
      if (response.data.status == 200) {
        this.setState({ reportData: response.data.result });
      }
    }
  }
  unitOptionChanged = (option) => {
    this.setState({ unit: option.value });
  };
  render() {
    let reportData = [];
    if (this.state.reportData.length > 0) {
      for (let i = 1; i <= 12; i++) {
        for (let j = 0; j < this.state.reportData.length; j++) {
          if (i == this.state.reportData[j].month) {
            reportData[i - 1] =
              this.state.reportData[j].avg_delievery_time /
              (this.state.unit == "hour" ? 3600 : 1);
            break;
          } else reportData[i - 1] = 0;
        }
      }
    }
    const data = (canvas) => {
      let bar = canvas.getContext("2d");
      let theme = bar.createLinearGradient(0, 300, 0, 0);
      theme.addColorStop(0, "#899FD4");
      theme.addColorStop(1, "#A389D4");

      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Average delivery time",
            data: reportData,
            borderColor: theme,
            backgroundColor: theme,
            hoverBorderColor: theme,
            hoverBackgroundColor: theme,
          },
        ],
      };
    };
    const unitOptions = [
      { value: "hour", label: "Hour" },
      { value: "second", label: "Second" },
    ];
    return (
      <Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Average delivery time</Card.Title>
            <div className="card-header-right" style={{ width: "100px" }}>
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={unitOptions[0]}
                onChange={this.unitOptionChanged}
                name="color"
                options={unitOptions}
              />
            </div>
          </Card.Header>
          <Card.Body>
            <HorizontalBar
              data={data}
              options={{
                barValueSpacing: 20,
              }}
            />
          </Card.Body>
        </Card>
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
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AverageDeliveryTime)
);
