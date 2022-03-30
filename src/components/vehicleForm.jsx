import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import {
  //   getVehicleManufacturers,
  //   getVehicleModel,
  saveVehicleManufacturer,
  saveVehicleModel,
  //   getVehicleYear,
  saveVehicleYear,
} from "../services/phpdbservice";
class VehicleForm extends Form {
  manufacturerSchema = {
    nameen: Joi.string().required().label("Manufacturer Name (EN)"),
    namear: Joi.string().required().label("Manufacturer Name (AR)"),
  };
  modelSchema = {
    modelnameen: Joi.string().required().label("Model Name (EN)"),
    modelnamear: Joi.string().required().label("Model Name (AR)"),
  };
  yearSchema = {
    year: Joi.number().required().min(1985).max(3000).label("Model Year"),
    enginespecs: Joi.string().required().label("Engine specifications"),
  };
  schema = this.manufacturerSchema;
  parseData() {
    const manufacturerId = this.props.match.params.manufacturerid || "0";
    const modelId = this.props.match.params.modelid || "0";
    const yearId = this.props.match.params.yearid || "0";
    return { manufacturerId, modelId, yearId };
  }
  initializeManufacturer() {
    this.schema = this.manufacturerSchema;
    this.state.required = { nameen: "", namear: "" };
    this.state.data = { nameen: "", namear: "", logo: "" };
  }
  initializeModel() {
    this.schema = this.modelSchema;
    this.state.required = { modelnameen: "", modelnamear: "" };
    this.state.data = { modelnameen: "", modelnamear: "", image: "" };
  }
  initializeYear() {
    this.schema = this.yearSchema;
    this.state.required = { year: "", enginespecs: "" };
    this.state.data = { year: "", enginespecs: "", image: "" };
  }
  async componentDidMount() {
    const { manufacturerId, modelId, yearId } = this.parseData();
    // const manufacturers = await getVehicleManufacturers();
    const { manufacturers } = this.props;
    if (manufacturerId === "new") {
      this.initializeManufacturer();
      return;
    }
    if (modelId === "new") {
      this.initializeModel();
      return;
    }
    if (yearId === "new") {
      this.initializeYear();
      return;
    }
    if (manufacturerId === "0") return this.props.history.replace("/not-found");
    if (modelId === "0") {
      const manufacturer = manufacturers.find((m) => m.id === manufacturerId);
      if (!manufacturer) return this.props.history.replace("/not-found");
      const required = {
        nameen: manufacturer.nameen,
        namear: manufacturer.namear,
      };
      this.schema = this.manufacturerSchema;
      this.setState({ data: manufacturer, required });
      return;
    }
    if (yearId === "0") {
      //   const model = await getVehicleModel(manufacturerId, modelId);
      const { model } = this.props;

      if (!model) return this.props.history.replace("/not-found");
      const required = {
        modelnameen: model.modelnameen,
        modelnamear: model.modelnamear,
      };
      this.schema = this.modelSchema;
      this.setState({ data: model, required });
      return;
    }
    //const yearObj = await getVehicleYear(modelId, yearId);
    const { yearObj } = this.props;
    if (!yearObj) return this.props.history.replace("/not-found");
    const required = {
      year: yearObj.year,
      enginespecs: yearObj.enginespecs,
    };
    this.schema = this.yearSchema;
    this.setState({ data: yearObj, required });
  }
  doSubmit = async () => {
    const { manufacturerId, modelId, yearId } = this.parseData();
    if (
      manufacturerId === "new" ||
      (manufacturerId !== "0" && modelId === "0")
    ) {
      let manufacturer = this.state.data;
      await saveVehicleManufacturer(manufacturer);
      return this.props.history.replace(`/vehicles/`);
    }
    if (modelId === "new" || (modelId !== "0" && yearId === "0")) {
      let model = this.state.data;
      model.manufacturerid = manufacturerId;
      await saveVehicleModel(model);
      return this.props.history.replace(`/vehicles/${manufacturerId}`);
    }
    if (yearId === "new" || yearId !== "0") {
      let yearObj = this.state.data;
      yearObj.modelid = modelId;
      await saveVehicleYear(yearObj);
      return this.props.history.replace(
        `/vehicles/${manufacturerId}/${modelId}`
      );
    }
  };
  renderMe() {
    const { manufacturerId, modelId, yearId } = this.parseData();
    if (manufacturerId === "new" || (manufacturerId !== "0" && modelId === "0"))
      return this.renderManufacturer();
    if (modelId === "new" || (modelId !== "0" && yearId === "0"))
      return this.renderModel();
    if (yearId === "new" || yearId !== "0") return this.renderYear();
  }
  renderManufacturer() {
    return (
      <div>
        {this.renderInput("nameen", "Manufacturer Name (EN)")}
        {this.renderInput("namear", "Manufacturer Name (AR)")}
        {this.renderInput("logo", "Manufacturer LOGO")}
      </div>
    );
  }
  renderModel() {
    return (
      <div>
        {this.renderInput("modelnameen", "Model Name (EN)")}
        {this.renderInput("modelnamear", "Model Name (AR)")}
        {this.renderInput("image", "Model Image")}
      </div>
    );
  }
  renderYear() {
    return (
      <div>
        {this.renderInput("year", "Model Year")}
        {this.renderInput("enginespecs", "Engine Specifications")}
        {this.renderInput("image", "Vehicle Image")}
      </div>
    );
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderMe()}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}
export default VehicleForm;
