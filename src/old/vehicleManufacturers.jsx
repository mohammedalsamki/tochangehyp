import React, { Component } from "react";
import {
  getVehicleManufacturers,
  deleteVehicleManufacturer,
} from "../services/phpdbservice";
import { Link } from "react-router-dom";
import VehicleManufacturersTable from "./vehicleManufacturersTable";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import FormattedNo from "./common/formatted-no";
//import ListGroup from "./common/listGroup";
import _ from "lodash";

class VehicleManufacturers extends Component {
  state = {
    vehicleManufacturers: [],
    pageSize: 10,
    currentPage: 1,
    //   selectedOrigin: null,
    sortColumn: { path: "id", order: "asc" },
  };
  async componentDidMount() {
    //const vehicleOrigins = [{ origin: "All", id: "" }, ...getVehicleOrigins()];
    const vMs = await getVehicleManufacturers();

    this.setState({
      vehicleManufacturers: vMs,
    });
  }
  handleDelete = async (vM) => {
    //--
    await deleteVehicleManufacturer(vM.id);

    const vMs = await getVehicleManufacturers();

    this.setState({
      vehicleManufacturers: vMs,
    });

    // const vehicleManufacturers = this.state.vehicleManufacturers.filter(
    //   (m) => vM.id !== m.id
    // );
    // this.setState({ vehicleManufacturers });
  };
  // handleSelect = (vM) => {
  //   vM.selected = !vM.selected;
  //   const vehicleManufacturers = this.state.vehicleManufacturers;
  //   vehicleManufacturers.map((v) =>
  //     v.id === vM.id ? (v.selected = vM.selected) : (v.selected = false)
  //   );
  //   this.setState({ vehicleManufacturers });
  // };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleOriginSelect = (origin) => {
    //this.setState({ selectedOrigin: origin, currentPage: 1 });
  };
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  getPagedData() {
    const {
      pageSize,
      currentPage,
      vehicleManufacturers: allVehiclemanufacturers,
      selectedOrigin,
      sortColumn,
    } = this.state;
    const filtered =
      selectedOrigin && selectedOrigin.id
        ? allVehiclemanufacturers.filter(
            (m) => m.originid === selectedOrigin.id
          )
        : allVehiclemanufacturers;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const pageVehicleManufacturers = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: pageVehicleManufacturers };
  }
  render() {
    const {
      pageSize,
      currentPage,
      vehicleManufacturers,
      sortColumn,
    } = this.state;

    if (vehicleManufacturers.length === 0) return <p>Database is Empty</p>;
    const { totalCount, data } = this.getPagedData();
    return (
      <div className="row">
        <div className="col-3">
          {/* <ListGroup
            items={this.state.vehicleOrigins}
            onItemSelect={this.handleOriginSelect}
            selectedItem={this.state.selectedOrigin}
          /> */}
        </div>
        <div className="col">
          <Link
            to="vehiclemanufacturers/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Manufacturer
          </Link>
          <p>
            Showing <FormattedNo val={data.length} /> Items of
            <FormattedNo val={totalCount} />
          </p>
          <VehicleManufacturersTable
            vehicleManufacturers={data}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSelect={this.props.onSelect}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}
export default VehicleManufacturers;
