import React, { Component } from "react";
import { getVehicleManufacturers } from "../utils/vehicles";
import MyModalForm from "./common/myModalForm";
import { Badge, Button } from "react-bootstrap";
import {
  saveVehicleManufacturer,
  deleteVehicleManufacturer,
  saveVehicleModel,
  deleteVehicleModel,
  saveVehicleYear,
  deleteVehicleYear,
} from "../services/phpdbservice";
import _ from "lodash";
import AlertDialog from "./common/alertDialog";
import VehiclesTreeView from "./vehiclesTreeView";

class Vehicles extends Component {
  state = {
    manufacturerPanels: [],
    manufacturers: [],
    activeModelIndex: -1,
    display: "None",
    modalData: { title: "", fields: [] },
    modalCallBy: "",
    modalShow: false,
    openAlertDialog: false,
    alertCallBy: "",
  };
  fuelTypes = [
    { val: "0", text: "Hybrid" },
    { val: "1", text: "Electric" },
    { val: "2", text: "Gasoline" },
    { val: "3", text: "Diesel" },
  ];
  manufacturerFields = [
    {
      type: "input",
      controlId: "nameen",
      label: "Manufacturer Name (EN)",
      placeholder: "Enter Manufacturer English Name",
      required: true,
    },
    {
      type: "input",
      controlId: "namear",
      label: "Manufacturer Name (AR)",
      placeholder: "Enter Manufacturer Arabic Name",
      required: true,
    },
    {
      type: "input",
      controlId: "logo",
      label: "Manufacturer LOGO)",
      placeholder: "Enter Manufacturer LOGO Link",
      required: false,
    },
  ];
  modelFields = [
    {
      type: "input",
      controlId: "nameen",
      label: "Model Name (EN)",
      placeholder: "Enter Model English Name",
      required: true,
    },
    {
      type: "input",
      controlId: "namear",
      label: "Model Name (AR)",
      placeholder: "Enter Model Arabic Name",
      required: true,
    },
    {
      type: "input",
      controlId: "image",
      label: "Model Image)",
      placeholder: "Enter Model Image Link",
      required: false,
    },
  ];

  yearFields = [
    {
      type: "input",
      controlId: "year",
      label: "Model Year",
      placeholder: "Enter Model Year",
      required: true,
    },
    {
      type: "select",
      controlId: "fueltype",
      label: "Fuel type",
      items: this.fuelTypes,
      placeholder: "Enter Model Year",
      required: true,
    },

    {
      type: "input",
      controlId: "enginespecs",
      label: "Engine Specs",
      placeholder: "Enter Engine Specifications",
      required: true,
    },
    {
      type: "input",
      controlId: "image",
      label: "Model Image)",
      placeholder: "Enter Model Image Link",
      required: false,
    },
  ];

  setModalShow(modalShow) {
    this.setState({ modalShow });
  }

  async componentDidMount() {
    let manufacturers = await getVehicleManufacturers();
    this.setState({
      manufacturers,
    });
  }

  handleModalSave = async (data) => {
    let { modalCallBy, manufacturers, manufacturer, model, year } = this.state;
    this.setState({ modalShow: false });
    if (modalCallBy === "manufacturer") {
      if (!manufacturer) manufacturer = {};
      Object.keys(data).map((key) => (manufacturer[key] = data[key]));
      let manufacturerInDB = manufacturers.find(
        (m) => m.id === manufacturer.id
      );
      if (!manufacturerInDB) {
        manufacturer.models = [];
        manufacturers.push(manufacturer);
      }
      this.setState({ manufacturers });
      await saveVehicleManufacturer(
        manufacturers,
        _.omit(manufacturer, "models")
      );
    }
    if (modalCallBy === "model") {
      if (!model) model = { manufacturerid: manufacturer.id };
      Object.keys(data).map((key) => (model[key] = data[key]));
      let modelInDB = manufacturer.models.find((m) => m.id === model.id);
      if (!modelInDB) {
        model.years = [];
        manufacturer.models.push(model);
      }
      this.setState({ manufacturer });
      await saveVehicleModel(manufacturer.models, _.omit(model, "years"));
    }
    if (modalCallBy === "year") {
      if (!year) year = { modelid: model.id };
      Object.keys(data).map((key) => (year[key] = data[key]));
      if (!year.fueltype) year.fueltype = "0";
      let yearInDB = model.years.find((m) => m.id === year.id);
      if (!yearInDB) {
        model.years.push(year);
      }
      this.setState({ model });
      await saveVehicleYear(model.years, year);
      // return (window.location = "/vehicles");
    }

    manufacturers = await getVehicleManufacturers();
    this.setState(manufacturers);
  };
  handleDialogConfirm = async (m) => {
    this.setState({ openAlertDialog: false });
    if (m === "0") return;
    const { alertCallBy } = this.state;
    if (alertCallBy.type === "manufacturer") {
      deleteVehicleManufacturer(alertCallBy.data);
      const { manufacturers } = this.state;
      let newManufacturers = manufacturers.filter(
        (m) => m.id !== alertCallBy.data.id
      );
      this.setState({ manufacturers: newManufacturers });
      return;
    }
    if (alertCallBy.type === "model") {
      deleteVehicleModel(alertCallBy.data);
      const { manufacturers } = this.state;
      let manufacturer = manufacturers.find(
        (m) => m.id === alertCallBy.data.manufacturerid
      );
      manufacturer.models = manufacturer.models.filter(
        (m) => m.id !== alertCallBy.data.id
      );
      this.setState({ manufacturers });
      return;
    }
    if (alertCallBy.type === "year") {
      const { model } = this.state;
      await deleteVehicleYear(alertCallBy.data);
      model.years = model.years.filter((y) => y.id !== alertCallBy.data.id);
      this.setState(model);
      // return (window.location = "/vehicles");
    }
  };
  handleManufacturerDelete = (manufacturer) => {
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete ${manufacturer.nameen} permanently from database`,
      alertCallBy: { type: "manufacturer", data: manufacturer },
    });
  };
  handleModelDelete = (model) => {
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete ${model.nameen} permanently from database`,
      alertCallBy: { type: "model", data: model },
    });
  };
  handleYearDelete = (year) => {
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete ${year.year} permanently from database`,
      alertCallBy: { type: "year", data: year },
    });
  };
  handleNewManufacturer = () => {
    const modalData = {
      title: "New  Vehicle Manufacturer",
      fields: this.manufacturerFields,
      data: { nameen: "", namear: "", logo: "" },
    };
    this.setState({
      modalData,
      modalShow: true,
      modalCallBy: "manufacturer",
      manufacturer: null,
      model: null,
      year: null,
    });
  };
  handleManufacturerEdit = (manufacturer) => {
    const modalData = {
      title: "Edit  Vehicle Manufacturer",
      fields: this.manufacturerFields,
      data: manufacturer,
    };
    this.setState({ modalData, modalShow: true, modalCallBy: "manufacturer" });
  };
  handleModelEdit = (model) => {
    const modalData = {
      title: `Edit ${model.nameen} Model `,
      fields: this.modelFields,
      data: model,
    };
    this.setState({ modalData, modalShow: true, modalCallBy: "model" });
  };
  handleYearEdit = (year) => {
    const modalData = {
      title: `Edit ${year.year}  `,
      fields: this.yearFields,
      data: year,
    };
    this.setState({ modalData, modalShow: true, modalCallBy: "year" });
  };

  handleNewModel = (manufacturer) => {
    const modalData = {
      title: `New  Model of ${manufacturer.nameen}`,
      fields: this.modelFields,
      data: { nameen: "", namear: "", image: "" },
    };
    this.setState({ modalData, modalShow: true, modalCallBy: "model" });
  };
  handleNewYear = (model) => {
    const modalData = {
      title: `New  Model Year of ${model.nameen}`,
      fields: this.yearFields,
      data: { nameen: "", namear: "", image: "" },
    };
    this.setState({ modalData, modalShow: true, modalCallBy: "year" });
  };
  renderVehicleTitle() {
    const { manufacturer, model, year } = this.state;
    return (
      <div>
        <h2>
          <Button
            variant="outline-primary m-2"
            onClick={this.handleNewManufacturer}
          >
            +
          </Button>
          <Badge variant="primary m-2">
            {manufacturer && manufacturer.nameen}
          </Badge>
          <Badge variant="secondary m-2">{model && model.nameen}</Badge>
          <Badge variant="light m-2">{year && year.year}</Badge>
        </h2>
      </div>
    );
  }
  handleManufacturerSelect = (manufacturer) => {
    this.setState({
      manufacturer,
      model: null,
      year: null,
    });
  };
  handleModelSelect = (model) => {
    this.setState({
      model,
      year: null,
    });
  };
  handleYearSelect = (year) => {
    this.setState({
      year,
    });
  };

  render() {
    const {
      manufacturers,
      modalShow,
      openAlertDialog,
      dialogMessage,
    } = this.state;
    return (
      <div className="row">
        <div className="col">
          {this.renderVehicleTitle()}
          <VehiclesTreeView
            manufacturers={manufacturers}
            fuelTypes={this.fuelTypes}
            onManufacturerSelect={this.handleManufacturerSelect}
            onModelSelect={this.handleModelSelect}
            onYearSelect={this.handleYearSelect}
            onManufacurerEdit={this.handleManufacturerEdit}
            onManufacturerDelete={this.handleManufacturerDelete}
            onNewModel={this.handleNewModel}
            onModelEdit={this.handleModelEdit}
            onModelDelete={this.handleModelDelete}
            onNewYear={this.handleNewYear}
            onYearEdit={this.handleYearEdit}
            onYearDelete={this.handleYearDelete}
          />
        </div>
        <div className="col">{this.state.display}</div>

        <MyModalForm
          show={modalShow}
          onHide={() => this.setModalShow(false)}
          onSave={this.handleModalSave}
          modaldata={this.state.modalData}
        />
        <AlertDialog
          open={openAlertDialog}
          onClose={this.handleDialogConfirm}
          message={dialogMessage}
        />
      </div>
    );
  }
}
export default Vehicles;
