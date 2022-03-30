import React, { Component } from "react";
import { getVehicleModels } from "../services/phpdbservice";
import { Link } from "react-router-dom";
import Pagination from "../components/common/pagination";
import { paginate } from "../utils/paginate";
import FormattedNo from "../components/common/formatted-no";
import VehicleModelsTable from "./vehicleModelsTable";
import _ from "lodash";

class VehicleModels extends Component {
  state = {
    vehicleModels: [],
    pageSize: 10,
    currentPage: 1,
    sortColumn: { path: "id", order: "asc" },
  };

  async componentDidMount() {
    const manufacturerId = this.props.manufacturerid;
    const vehicleModels = await getVehicleModels(manufacturerId);
    this.setState({ vehicleModels });
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  getPagedData() {
    const { pageSize, currentPage, vehicleModels, sortColumn } = this.state;

    const sorted = _.orderBy(
      vehicleModels,
      [sortColumn.path],
      [sortColumn.order]
    );

    const pageVehicleModels = paginate(sorted, currentPage, pageSize);
    return { totalCount: sorted.length, data: pageVehicleModels };
  }

  render() {
    const { pageSize, currentPage, vehicleModels, sortColumn } = this.state;

    if (vehicleModels.length === 0) return <p>Database is Empty</p>;
    const { totalCount, data } = this.getPagedData();
    return (
      <div className="row">
        <div className="col-1"></div>
        <div className="col">
          <Link
            to="vehiclemodels/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Model
          </Link>
          <p>
            Showing <FormattedNo val={data.length} /> Items of
            <FormattedNo val={totalCount} />
          </p>
          <VehicleModelsTable
            vehicleModels={data}
            sortColumn={sortColumn}
            //onDelete={this.handleDelete}
            //onSelect={this.handleSelect}
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

export default VehicleModels;
