import React, { Component } from "react";
import VehicleNavBar from "./vehicleNavBar";
import { Link } from "react-router-dom";
import {
  getVehicleManufacturers,
  getVehicleModels,
  deleteVehicleManufacturer,
  getVehicleYears,
  getVehicleYear,
  deleteVehicleModel,
  deleteVehicleYear,
} from "../services/phpdbservice";
import AlertDialog from "./common/alertDialog";
import DbComponent from "./common/dbComponent";

class Vehicles extends Component {
  vehicleManufacturerColumns = [
    {
      path: "nameen",
      label: "Name (EN)",
    },
    {
      path: "namear",
      label: "Name (AR)",
    },
    {
      key: "logo",
      label: "Logo",
      content: (item) => (
        <img src={item.logo} style={{ width: 50, height: 50 }} alt={item.id} />
      ),
    },
    {
      key: "totalmodels",
      label: "Models",
      content: (item) => (
        <Link
          id={item.id}
          to={`/vehicles/${item.id}`}
          aria-hidden="true"
          className={
            item.totalmodels === "0"
              ? "badge badge-warning m-2"
              : "badge badge-primary m-2 "
          }
        >
          {item.totalmodels}
        </Link>
      ),
    },
    {
      key: "edit",
      content: (item) => (
        <Link
          to={`/vehicleform/${item.id}`}
          className="btn btn-primary btn-sm "
        >
          ...
        </Link>
      ),
    },
    {
      key: "delete",
      content: (item) => (
        <button
          className="btn btn-danger btn-sm "
          disabled={!(item.totalmodels === "0")}
          onClick={() => this.handleButtonDelete(item, item.nameen)}
        >
          X
        </button>
      ),
    },
  ];

  vehicleModelColumns = [
    {
      path: "modelnameen",
      label: "Name (EN)",
    },
    {
      path: "modelnamear",
      label: "Name (AR)",
    },
    {
      key: "image",
      label: "Image",
      content: (item) => (
        <img src={item.image} style={{ width: 50, height: 50 }} alt={item.id} />
      ),
    },

    {
      key: "totalyears",
      label: "Years",
      content: (item) => (
        <Link
          id={item.id}
          to={`/vehicles/${this.state.manufacturer.id}/${item.id}`}
          aria-hidden="true"
          className={
            item.totalyears === "0"
              ? "badge badge-warning m-2"
              : "badge badge-primary m-2 "
          }
        >
          {item.totalyears}
        </Link>
      ),
    },

    {
      key: "edit",
      content: (item) => (
        <Link
          to={`/vehicleform/${this.state.manufacturer.id}/${item.id}`}
          className="btn btn-primary btn-sm "
        >
          ...
        </Link>
      ),
    },
    {
      key: "delete",
      content: (item) => (
        <button
          className="btn btn-danger btn-sm "
          disabled={!(item.totalyears === "0")}
          onClick={() => this.handleButtonDelete(item, item.modelnameen)}
        >
          X
        </button>
      ),
    },
  ];
  vehicleYearColumns = [
    {
      path: "year",
      label: "Model Year",
    },
    {
      path: "enginespecs",
      label: "Engine Specifications",
    },
    {
      key: "image",
      label: "Image",
      content: (item) => (
        <img src={item.image} style={{ width: 50, height: 50 }} alt={item.id} />
      ),
    },
    {
      key: "edit",
      content: (item) => (
        <Link
          to={`/vehicleform/${this.state.manufacturer.id}/${this.state.model.id}/${item.id}`}
          className="btn btn-primary btn-sm "
        >
          ...
        </Link>
      ),
    },
    {
      key: "delete",
      content: (item) => (
        <button
          className="btn btn-danger btn-sm "
          // disabled={!(item.totalyears === "0")}
          onClick={() => this.handleButtonDelete(item, item.year)}
        >
          X
        </button>
      ),
    },
  ];
  state = {
    pageSize: 10,
    currentPage: 1,
    sortColumn: { path: "id", order: "asc" },
    manufacturers: [],
    models: [],
    years: [],
    manufacturer: { id: "0", nameen: "", namear: "" },
    model: { id: "0", nameen: "", namear: "" },
    year: { id: "0", modelid: "", year: "", enginespecs: "", image: "" },
  };
  parseData() {
    const manufacturerId = this.props.match.params.manufacturerid || "0";
    const modelId = this.props.match.params.modelid || "0";
    const yearId = this.props.match.params.yearid || "0";

    return { manufacturerId, modelId, yearId };
  }
  async updateState() {
    const { manufacturerId, modelId, yearId } = this.parseData();
    const manufacturers = await getVehicleManufacturers();
    if (manufacturerId === "0") {
      this.setState({ manufacturers });
      return;
    }
    const manufacturer = manufacturers.find((m) => m.id === manufacturerId);

    if (modelId === "0") {
      const models = await getVehicleModels(manufacturer.id);
      this.setState({ manufacturers, manufacturer, models });
      return;
    }
    const model = await getVehicleModel(manufacturerId, modelId);
    if (yearId === "0") {
      const years = await getVehicleYears(model.id);
      this.setState({ manufacturer, model, years });
      return;
    }
    const year = await getVehicleYear(modelId, yearId);
    this.setState({ manufacturer, model, year });
  }
  async componentDidMount() {
    this.state.manufacturers = [];
    this.updateState();
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.updateState();
    }
  }
  handleButtonDelete(item, label) {
    this.setState({
      openDialog: true,
      dialogMessage: `Delete ${label} permanently from database`,
      selectedItem: item,
    });
  }

  handleDialogConfirm = async (m) => {
    if (m === "0") {
      this.setState({ openDialog: false });
      return;
    }
    const { manufacturer, model, year, selectedItem } = this.state;
    this.state.openDialog = false;
    if (manufacturer.id === "0") {
      await deleteVehicleManufacturer(selectedItem);
      this.state.manufacturers = [];
      this.updateState();
      return;
    }
    if (model.id === "0") {
      await deleteVehicleModel(selectedItem);
      this.state.models = [];
      this.updateState();
      return;
    }
    if (year.id === "0") {
      await deleteVehicleYear(selectedItem);
      this.state.years = [];
      this.updateState();
    }
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  renderdbComponent() {
    const {
      manufacturer,
      model,
      year,
      manufacturers,
      models,
      years,
    } = this.state;
    if (manufacturer.id === "0") {
      return (
        <div>
          <DbComponent
            items={manufacturers}
            columns={this.vehicleManufacturerColumns}
            currentPage={this.state.currentPage}
            onPageChange={this.handlePageChange}
            newItemLink={"/vehicleform/new"}
            tableName="CarManufacturers"
          />
        </div>
      );
    }
    if (model.id === "0") {
      return (
        <DbComponent
          items={models}
          columns={this.vehicleModelColumns}
          currentPage={this.state.currentPage}
          onPageChange={this.handlePageChange}
          newItemLink={`/vehicleform/${manufacturer.id}/new`}
          tableName="CarModels"
        />
      );
    }
    if (year.id === "0") {
      return (
        <DbComponent
          items={years}
          columns={this.vehicleYearColumns}
          currentPage={this.state.currentPage}
          onPageChange={this.handlePageChange}
          newItemLink={`/vehicleform/${manufacturer.id}/${model.id}/new`}
          tableName="CarYears"
        />
      );
    }
    if (year.id !== "0") {
      return (
        <h1>{`${this.state.manufacturer.nameen} >>${this.state.model.modelnameen} >> ${this.state.year.year}`}</h1>
      );
    }
  }
  render() {
    let { manufacturer, model, year } = this.state;
    return (
      <div>
        <VehicleNavBar manufacturer={manufacturer} model={model} year={year} />
        {this.renderdbComponent()}
        <AlertDialog
          open={this.state.openDialog}
          onClose={this.handleDialogConfirm}
          message={this.state.dialogMessage}
        />
      </div>
    );
  }
}

export default Vehicles;
