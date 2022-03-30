import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
class LinkPartVehiclesForm extends Component {
  state = {
    brandPartVehicle: null,
    validated: true,
    vehicleManufacturer: null,
    vehicleModel: null,
    year1: null,
    year2: null,
  };
  data = {};
  handleSubmit = (event) => {
    const { vehicleManufacturer, vehicleModel, year1, year2 } = this.state;
    let brandPartVehicle = this.state.brandPartVehicle;
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (!brandPartVehicle) {
        brandPartVehicle = {};
      }
      brandPartVehicle.brandpartid = this.props.brandPart.id;
      brandPartVehicle.vehiclemanufacturerid = vehicleManufacturer.id;
      brandPartVehicle.vehiclemodelid = vehicleModel.id;
      brandPartVehicle.manufacturernameen = vehicleManufacturer.nameen;
      brandPartVehicle.modelnameen = vehicleModel.nameen;
      brandPartVehicle.year1 = year1;
      brandPartVehicle.year2 = year2;
      this.props.onSave(brandPartVehicle);
    }
    this.setState({ validated: true });
  };
  handleVehicleManufacturerChange = ({ currentTarget: input }) => {
    const { vehicles } = this.props;
    const vehicleManufacturer = vehicles.find((v) => v.id === input.value);
    let vehicleModel = null;
    let year1 = null;
    let year2 = null;
    if (
      vehicleManufacturer &&
      vehicleManufacturer.models &&
      vehicleManufacturer.models.length > 0
    )
      vehicleModel = vehicleManufacturer.models[0];
    if (vehicleModel && vehicleModel.years && vehicleModel.years.length > 0) {
      year1 = vehicleModel.years[0];
      year2 = vehicleModel.years[0];
    }
    this.setState({ vehicleManufacturer, vehicleModel, year1, year2 });
  };
  handleVehicleModelChange = ({ currentTarget: input }) => {
    const { vehicleManufacturer } = this.state;
    const vehicleModel = vehicleManufacturer.models.find(
      (m) => m.id === input.value
    );
    let year1 = null;
    let year2 = null;
    if (vehicleModel && vehicleModel.years && vehicleModel.years.length > 0) {
      year1 = vehicleModel.years[0];
      year2 = vehicleModel.years[0];
    }
    this.setState({ vehicleModel, year1, year2 });
  };
  handleVehicleYear1Change = ({ currentTarget: input }) => {
    const year1 = input.value;
    this.setState({ year1, year2: year1 });
  };
  handleVehicleYear2Change = ({ currentTarget: input }) => {
    const year2 = input.value;
    this.setState({ year2 });
  };
  renderSelect(label, onSelect, items, itemVal, itemText, defaultVal) {
    return (
      <Form.Group controlId={label}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          as="select"
          onChange={onSelect}
          required={true}
          value={defaultVal}
        >
          {items &&
            items.map((item) => (
              <option value={item[itemVal]} key={item[itemVal]}>
                {item[itemText]}
              </option>
            ))}
        </Form.Control>
      </Form.Group>
    );
  }
  renderNewVehicle() {
    const { vehicles } = this.props;
    const { vehicleManufacturer, vehicleModel, year1, year2 } = this.state;
    return (
      <div>
        {vehicles &&
          this.renderSelect(
            "Vehicle Manufacturer",
            this.handleVehicleManufacturerChange,
            vehicles,
            "id",
            "nameen",
            vehicleManufacturer && vehicleManufacturer.id
          )}
        {vehicleManufacturer &&
          this.renderSelect(
            "Vehicle Model",
            this.handleVehicleModelChange,
            vehicleManufacturer.models,
            "id",
            "nameen",
            vehicleModel && vehicleModel.id
          )}
        {vehicleModel &&
          this.renderSelect(
            "From Year",
            this.handleVehicleYear1Change,
            vehicleModel.years,
            "year",
            "year",
            year1
          )}
        {vehicleModel &&
          year1 &&
          this.renderSelect(
            "To Year",
            this.handleVehicleYear2Change,
            vehicleModel.years.filter(
              (y) => parseInt(y.year) >= parseInt(year1)
            ),
            "year",
            "year",
            year2
          )}
      </div>
    );
  }
  componentDidUpdate(prevProps) {
    if (prevProps.showType !== this.props.showType) {
      this.renderVehicleEdit();
    }
  }
  renderVehicleEdit() {
    const { showType } = this.props;
    if (showType !== "edit") return;
    const { vehicles, vehicle } = this.props;
    let brandPartVehicle = vehicle;
    if (!vehicles) return;
    let vehicleManufacturer = vehicles.find(
      (v) => v.id === vehicle.vehiclemanufacturerid
    );
    if (!vehicleManufacturer) return;
    let vehicleModel = vehicleManufacturer.models.find(
      (m) => m.id === vehicle.vehiclemodelid
    );
    if (!vehicleModel) return;
    let year1 = vehicle.year1;
    let year2 = vehicle.year2;
    this.setState({
      vehicleManufacturer,
      vehicleModel,
      year1,
      year2,
      brandPartVehicle,
    });
  }
  render() {
    const { onHide, brandPart, show } = this.props;
    const { validated } = this.state;
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {brandPart && brandPart.partnameen}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
            <div className="form-group">{this.renderNewVehicle()}</div>
            <Button type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
export default LinkPartVehiclesForm;
