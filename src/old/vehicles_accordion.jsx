import React, { Component } from "react";
import { getVehicles } from "../services/phpdbservice";
import MyModalForm from "./common/myModalForm";
import { Accordion } from "semantic-ui-react";
import { Badge, Button, ListGroup } from "react-bootstrap";
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

class Vehicles extends Component {
  state = {
    manufacturerPanels: [],
    vehicles: [],
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
  getModels(vehicles) {
    let models = vehicles.map((v) => ({
      id: v.modelid,
      nameen: v.modelnameen,
      namear: v.modelnamear,
      image: v.modelimage,
      manufacturerid: v.manufacturerid,
    }));
    models = _.uniqBy(models, "id");
    return models;
  }
  getYearsContent(manufacturer, model, years) {
    let modelYears = years.filter((y) => y.yearid !== null);
    modelYears = modelYears.map(
      (y) =>
        y.yearid && {
          id: y.yearid,
          year: y.modelyear,
          fueltype: y.fueltype,
          enginespecs: y.enginespecs,
          image: y.modelyearimage,
          modelid: y.modelid,
        }
    );
    model.years = _.uniqBy(modelYears, "id");
    // const year = model.years[parseInt(localStorage.getItem("activeYearIndex"))];
    console.log("from getYears Content this.state.year", this.state.year);
    return (
      <div>
        <div>
          <h2>
            <Badge variant="secondary m-2">{model.namear}</Badge>
            <Button
              variant="outline-primary m-2"
              onClick={() => this.handleNewYear(manufacturer, model)}
            >
              Add Year
            </Button>
            <Button
              variant="outline-warning m-2"
              onClick={() => this.handleModelEdit(manufacturer, model)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger m-2"
              disabled={model.years.length > 0}
              onClick={() => this.handleModelDelete(manufacturer, model)}
            >
              Delete
            </Button>
          </h2>
        </div>
        <ListGroup>
          {model.years.map(
            (y) =>
              y &&
              y.id && (
                <ListGroup.Item
                  key={y.id}
                  onClick={() => this.handleYearClick(y)}
                  active={this.state.year && this.state.year.id === y.id}
                >
                  <div>
                    <h2>
                      <Badge variant="info m-2">{y.year}</Badge>
                      <Badge variant="info m-2">
                        {this.fuelTypes[parseInt(y.fueltype)].text}
                      </Badge>
                      <Badge variant="info m-2">{y.enginespecs}</Badge>

                      <Button
                        variant="outline-warning m-2"
                        onClick={() =>
                          this.handleYearEdit(manufacturer, model, y)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger m-2"
                        onClick={() =>
                          this.handleYearDelete(manufacturer, model, y)
                        }
                      >
                        Delete
                      </Button>
                    </h2>
                  </div>
                </ListGroup.Item>
              )
          )}
        </ListGroup>
      </div>
    );
  }
  getModelsContent(manufacturer, vehicles) {
    let models = vehicles.map(
      (v) =>
        v.modelid && {
          id: v.modelid,
          nameen: v.modelnameen,
          namear: v.modelnamear,
          image: v.modelimage,
          manufacturerid: v.manufacturerid,
        }
    );
    models = _.uniqBy(models, "id");
    manufacturer.models = models;
    const modelPanels = models.map(
      (m) =>
        m && {
          key: m.id,
          title: m.nameen,
          content: {
            content:
              m &&
              this.getYearsContent(
                manufacturer,
                m,
                vehicles.filter(
                  (v) =>
                    v.manufacturerid === m.manufacturerid && v.modelid === m.id
                )
              ),
          },
        }
    );

    return (
      <div>
        <div>
          <h2>
            <img
              src={manufacturer.logo}
              style={{ width: 50, height: 50 }}
              alt={manufacturer.id}
            />
            <Badge variant="secondary lg m-2">
              {manufacturer && manufacturer.namear}
            </Badge>
            <Button
              variant="outline-primary m-2"
              onClick={() => this.handleNewModel(manufacturer)}
            >
              Add Model
            </Button>
            <Button
              variant="outline-warning m-2"
              onClick={() => this.handleManufacturerEdit(manufacturer)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger m-2"
              disabled={manufacturer.models.length > 0}
              onClick={() => this.handleManufacturerDelete(manufacturer)}
            >
              Delete
            </Button>
          </h2>
        </div>
        <Accordion.Accordion
          panels={modelPanels}
          defaultActiveIndex={parseInt(
            localStorage.getItem("activeModelIndex")
          )}
          onTitleClick={this.handleModelTitleClick}
        />
      </div>
    );
  }
  async updateState() {
    const vehicles = await getVehicles();
    let manufacturers = vehicles.map((v) => ({
      id: v.manufacturerid,
      nameen: v.manufacturernameen,
      namear: v.manufacturernamear,
      logo: v.manufacturerlogo,
    }));
    manufacturers = _.uniqBy(manufacturers, "id");
    const manufacturerPanels = manufacturers.map((m) => ({
      key: m.id,
      title: m.nameen,
      content: {
        content: this.getModelsContent(
          m,
          vehicles.filter(
            (v) => v.manufacturerid === m.id && v.modelid !== null
          )
        ),
      },
    }));
    const activeManufacturerIndex = parseInt(
      localStorage.getItem("activeManufacturerIndex")
    );
    const manufacturer = manufacturers[activeManufacturerIndex];
    const activeModelIndex = parseInt(localStorage.getItem("activeModelIndex"));
    const model =
      manufacturer &&
      manufacturer.models &&
      manufacturer.models[activeModelIndex];
    const activeYearIndex = parseInt(localStorage.getItem("activeYearIndex"));
    const year = model && model.years && model.years[activeYearIndex];
    console.log("from updatestate year", year);
    this.setState({
      manufacturers,
      manufacturer,
      model,
      year,
      manufacturerPanels,
      activeManufacturerIndex,
    });
  }

  componentDidMount() {
    this.updateState();
  }
  handleManufacturerTitleClick = (e, itemProps) => {
    const { index } = itemProps;
    const { activeManufacturerIndex, manufacturers } = this.state;
    const newmanufacturerIndex = activeManufacturerIndex === index ? -1 : index;
    const manufacturer =
      newmanufacturerIndex === -1 ? null : manufacturers[newmanufacturerIndex];
    localStorage.setItem("activeManufacturerIndex", newmanufacturerIndex);
    localStorage.setItem("activeModelIndex", -1);
    localStorage.setItem("activeYearIndex", -1);
    this.setState({
      activeManufacturerIndex: newmanufacturerIndex,
      manufacturer,
      activeModelIndex: -1,
      model: null,
    });
  };
  handleModelTitleClick = (e, itemProps) => {
    const { index } = itemProps;
    const { activeModelIndex, manufacturer } = this.state;
    const newModelIndex = activeModelIndex === index ? -1 : index;
    const model =
      newModelIndex === -1 ? null : manufacturer.models[newModelIndex];

    localStorage.setItem("activeModelIndex", newModelIndex);
    localStorage.setItem("activeYearIndex", -1);
    this.setState({ activeModelIndex: newModelIndex, model });
  };
  handleYearClick = (year) => {
    localStorage.setItem(
      "activeYearIndex",
      this.state.model.years.indexOf(year)
    );
    this.updateState();
    this.setState({ year });
  };

  handleModalSave = async (data) => {
    let { modalCallBy, manufacturers, manufacturer, model, year } = this.state;
    this.setState({ modalShow: false });
    if (modalCallBy === "manufacturer") {
      if (!manufacturer) manufacturer = {};
      Object.keys(data).map((key) => (manufacturer[key] = data[key]));
      await saveVehicleManufacturer(
        manufacturers,
        _.omit(manufacturer, "models")
      );
      return (window.location = "/");
    }
    if (modalCallBy === "model") {
      if (!model) model = { manufacturerid: manufacturer.id };

      Object.keys(data).map((key) => (model[key] = data[key]));

      await saveVehicleModel(manufacturer.models, _.omit(model, "years"));
      return (window.location = "/");
    }
    if (modalCallBy === "year") {
      if (!year) year = { modelid: model.id };
      Object.keys(data).map((key) => (year[key] = data[key]));
      await saveVehicleYear(model.years, year);
      return (window.location = "/");
    }
  };
  handleDialogConfirm = async (m) => {
    this.setState({ openAlertDialog: false });
    if (m === "0") return;
    const { alertCallBy } = this.state;

    if (alertCallBy.type === "manufacturer") {
      await deleteVehicleManufacturer(alertCallBy.data);
      window.location = "/";
      return;
    }
    if (alertCallBy.type === "model") {
      await deleteVehicleModel(alertCallBy.data);
      window.location = "/";
      return;
    }
    if (alertCallBy.type === "year") {
      await deleteVehicleYear(alertCallBy.data);
      window.location = "/";
      return;
    }
  };
  handleManufacturerDelete = (manufacturer) => {
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete ${manufacturer.nameen} permanently from database`,
      alertCallBy: { type: "manufacturer", data: manufacturer },
    });
  };
  handleModelDelete = (manufacturer, model) => {
    console.log("model", model);

    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete ${manufacturer.nameen} ${model.nameen} permanently from database`,
      alertCallBy: { type: "model", data: model },
    });
  };
  handleYearDelete = (manufacturer, model, year) => {
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete ${manufacturer.nameen} ${model.nameen}  ${year.year} permanently from database`,
      alertCallBy: { type: "year", data: year },
    });
  };
  handleNewManufacturer = () => {
    const modalData = {
      title: "New  Vehicle Manufacturer",
      fields: this.manufacturerFields,
      data: { nameen: "", namear: "", logo: "" },
    };
    this.setState({ modalData, modalShow: true, modalCallBy: "manufacturer" });
  };
  handleManufacturerEdit = (manufacturer) => {
    const modalData = {
      title: "Edit  Vehicle Manufacturer",
      fields: this.manufacturerFields,
      data: manufacturer,
    };
    this.setState({ modalData, modalShow: true, modalCallBy: "manufacturer" });
  };
  handleModelEdit = (manufacturer, model) => {
    const modalData = {
      title: `Edit ${manufacturer.nameen} Model `,
      fields: this.modelFields,
      data: model,
    };
    this.setState({ modalData, modalShow: true, modalCallBy: "model" });
  };
  handleYearEdit = (manufacturer, model, year) => {
    const modalData = {
      title: `Edit ${manufacturer.nameen} ${model.nameen}  `,
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
  handleNewYear = (manufacturer, model) => {
    const modalData = {
      title: `New  Model Year of ${manufacturer.nameen} ${model.nameen}`,
      fields: this.yearFields,
      data: { nameen: "", namear: "", image: "" },
    };
    this.setState({ modalData, modalShow: true, modalCallBy: "year" });
  };
  render() {
    const {
      manufacturer,
      model,
      manufacturerPanels,
      modalShow,
      openAlertDialog,
      dialogMessage,
    } = this.state;
    return (
      <div className="row">
        <div className="col">
          <div>
            <h2>
              <Button
                variant="outline-primary m-2"
                onClick={this.handleNewManufacturer}
              >
                New
              </Button>
              <Badge variant="primary m-2">
                {manufacturer && manufacturer.nameen}
              </Badge>
              <Badge variant="secondary">{model && model.nameen}</Badge>
            </h2>
          </div>
          <Accordion
            defaultActiveIndex={parseInt(
              localStorage.getItem("activeManufacturerIndex")
            )}
            panels={manufacturerPanels}
            onTitleClick={this.handleManufacturerTitleClick}
            styled
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
