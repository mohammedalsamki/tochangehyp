import React, { Component } from "react";
import Selector from "../components/common/selectoricon";
import Table from "../components/common/table";
import { Link } from "react-router-dom";
class VehicleManufacturersTable extends Component {
  columns = [
    {
      key: "select",
      content: (item) => (
        <Selector
          selected={item.selected}
          onSelect={() => this.props.onSelect(item)}
        />
      ),
    },
    { path: "id", label: "ID" },
    {
      path: "nameen",
      label: "Name (EN)",
      content: (item) => (
        <Link to={`/vehiclemanufacturers/${item.id}`}>{item.nameen}</Link>
      ),
    },
    {
      path: "namear",
      label: "Name (AR)",
      content: (item) => <Link to={`/vehicles/${item.id}`}>{item.namear}</Link>,
    },
    {
      key: "logo",
      label: "Logo",
      content: (item) => (
        <img src={item.logo} style={{ width: 50, height: 50 }} alt={item.id} />
      ),
    },
    {
      key: "delete",
      content: (item) => (
        <button
          onClick={() => this.props.onDelete(item)}
          className="btn btn-danger btn-sm "
        >
          Delete
        </button>
      ),
    },
  ];

  render() {
    const { sortColumn, onSort, vehicleManufacturers } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={vehicleManufacturers}
      />
    );
  }
}

export default VehicleManufacturersTable;
