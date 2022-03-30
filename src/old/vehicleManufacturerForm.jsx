import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import {
  getVehicleManufacturer,
  saveVehicleManufacturer,
} from "../services/phpdbservice";
class VehicleManufacturerForm extends Form {
  state = {
    data: {
      id: "",
      nameen: "",
      namear: "",
      descriptionen: "",
      descriptionar: "",
      logo: "",
    },
    required: { nameen: "", namear: "" },
    origins: [],
    errors: {},
  };
  schema = {
    nameen: Joi.string().required().label("Name (EN)"),
    namear: Joi.string().required().label("Name (AR)"),
  };
  async componentDidMount() {
    const vehicleManufacturerId = this.props.match.params.id;
    if (vehicleManufacturerId === "new") return;

    const vehicleManufacturer = await getVehicleManufacturer(
      vehicleManufacturerId
    );

    if (!vehicleManufacturer) return this.props.history.replace("/not-found");

    const required = this.state.required;
    console.log(required);
    for (let prop in required) required[prop] = vehicleManufacturer[prop];

    this.setState({ data: vehicleManufacturer, required });
  }

  doSubmit = async () => {
    await saveVehicleManufacturer(this.state.data);
    this.props.history.push("/vehiclemanufacturers");
  };

  render() {
    return (
      <div>
        <h1>Vehicle Manufacturer Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("nameen", "Name (EN)")}
          {this.renderInput("namear", "Name (AR)")}
          {this.renderInput("logo", "LOGO")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default VehicleManufacturerForm;
