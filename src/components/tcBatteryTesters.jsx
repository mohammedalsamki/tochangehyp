import React, { Component } from "react";
import { showDevData } from "../services/phpdbservice";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import _ from "lodash";

class TCBatteryTesters extends Component {
  state = {
    deviceId: 1,
    batteryTesterObj: null,
    channels: [1, 2, 3, 4, 5, 6, 7, 8],
  };
  componentDidMount() {
    const deviceId = this.props.match.params.devid;

    // this.setState({ deviceId });
    this.interval = setInterval(() => this.showFile(deviceId), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  showFile = async (deviceId) => {
    const batteryTesterObj = await showDevData(deviceId);
    console.log(batteryTesterObj);

    this.setState({ batteryTesterObj });
  };
  renderTitle() {
    const { batteryTesterObj } = this.state;
    return (
      <div>
        <h3>
          Device Name:
          <span className="badge badge-light m-2">
            {batteryTesterObj.devicename}
          </span>
          Customer Name:
          <span className="badge badge-light m-2">
            {batteryTesterObj.customername}
          </span>
          Customer tel:
          <span className="badge badge-light m-2">
            {batteryTesterObj.customertel}
          </span>
          PC time:
          <span className="badge badge-light m-2">
            {batteryTesterObj.pctime}
          </span>
          Test time:
          <span className="badge badge-light m-2">
            {batteryTesterObj.testtotaltime}
          </span>
        </h3>
      </div>
    );
  }

  renderChannelsTable() {
    const { batteryTesterObj, channels } = this.state;
    return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Module #</th>
            <th>Volt</th>
            <th>Ampere</th>
            <th>Time</th>
            <th>mAH</th>
          </tr>
        </thead>
        <tbody>
          {batteryTesterObj &&
            channels.map((ch) => (
              <tr>
                <td>{ch}</td>
                <td>{batteryTesterObj["channel" + ch + "moduleno"]}</td>
                <td>{batteryTesterObj["channel" + ch + "volt"]}</td>
                <td>{batteryTesterObj["channel" + ch + "ampere"]}</td>
                <td>{batteryTesterObj["channel" + ch + "time"]}</td>
                <td>{batteryTesterObj["channel" + ch + "mah"]}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
  }

  renderCycleTable(cycleNo) {
    const { batteryTesterObj } = this.state;
    const modules = _.range(1, 35);
    return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Discharge mAH</th>
            <th>Discharge Time</th>
            <th>Charge mAH</th>
            <th>Charge Time</th>
          </tr>
        </thead>
        <tbody>
          {batteryTesterObj &&
            modules.map((mod) => (
              <tr>
                <td>{mod}</td>
                <td>
                  {batteryTesterObj["cycle" + cycleNo + "mod" + mod + "dismah"]}
                </td>
                <td>
                  {
                    batteryTesterObj[
                      "cycle" + cycleNo + "mod" + mod + "distime"
                    ]
                  }
                </td>
                <td>
                  {batteryTesterObj["cycle" + cycleNo + "mod" + mod + "chgmah"]}
                </td>
                <td>
                  {
                    batteryTesterObj[
                      "cycle" + cycleNo + "mod" + mod + "chgtime"
                    ]
                  }
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
  }

  render() {
    const { batteryTesterObj } = this.state;

    return (
      <div>
        {batteryTesterObj && this.renderTitle()}
        <div className="col">
          <Tabs defaultActiveKey="livedata" id="uncontrolled-tab-example">
            <Tab eventKey="livedata" title="Test Channels">
              {this.renderChannelsTable()}
            </Tab>
            <Tab eventKey="cycle1" title="Cycle 1">
              {this.renderCycleTable(1)}
            </Tab>
            <Tab eventKey="cycle2" title="Cycle 2">
              {this.renderCycleTable(2)}
            </Tab>
            <Tab eventKey="cycle3" title="Cycle 3">
              {this.renderCycleTable(3)}
            </Tab>
            <Tab eventKey="cycle4" title="Cycle 4">
              {this.renderCycleTable(4)}
            </Tab>
            <Tab eventKey="cycle5" title="Cycle 5">
              {this.renderCycleTable(5)}
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default TCBatteryTesters;
