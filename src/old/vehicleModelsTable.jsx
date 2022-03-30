import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";
class VehicleModelsTable extends Component {
  columns = [
    { path: "id", label: "ID" },
    {
      path: "modelnameen",
      label: "Name (EN)",
      content: (item) => (
        <Link to={`/vehicleModels/${item.id}`}>{item.modelnameen}</Link>
      ),
    },
    {
      path: "modelnamear",
      label: "Name (AR)",
      content: (item) => (
        <Link to={`/vehicles/${item.id}`}>{item.modelnamear}</Link>
      ),
    },
    {
      key: "image",
      label: "Image",
      content: (item) => (
        <img src={item.image} style={{ width: 50, height: 50 }} alt={item.id} />
      ),
    },
  ];

  render() {
    const { sortColumn, onSort, vehicleModels } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={vehicleModels}
      />
    );
  }
}

export default VehicleModelsTable;
