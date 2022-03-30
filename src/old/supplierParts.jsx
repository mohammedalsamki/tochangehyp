import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { getSupplier, getSupplierParts } from "../services/phpdbservice";
import DbComponent from "../components/common/dbComponent";
import ListGroup from "../components/common/listGroup";

import _ from "lodash";

class SupplierParts extends Component {
  supplierPartsColumns = [
    {
      path: "brandname",
      label: "Brand",
      content: (item) => (
        <img
          src={item.brandlogo}
          style={{ width: 40, height: 40 }}
          alt={item.brandname}
        />
      ),
    },
    { path: "brandpartnameen", label: "Part Name" },

    {
      path: "status",
      label: "Status",
    },
    {
      path: "numberofparts",
      label: "#. Parts",
    },
    {
      path: "unitprice",
      label: "Unit Price",
    },
    {
      key: "delete",
      content: (item) => (
        <button
          className="btn btn-danger btn-sm "
          onClick={() => this.handleButtonDelete(item, item.nameen)}
        >
          X
        </button>
      ),
    },
  ];
  state = {
    supplier: {},
    supplierParts: [],
    filteredParts: [],
    currentPage: 1,
  };

  parseData() {
    const supplierId = this.props.match.params.supplierid || "0";
    return { supplierId };
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  async updateState() {
    const { supplierId } = this.parseData();
    if (supplierId === "0") return;
    const supplier = await getSupplier(supplierId);
    if (!supplier) return;

    const supplierParts = await getSupplierParts(supplier);
    const filteredParts = supplierParts;
    let allBrands = supplierParts.map(({ brandid, brandname }) => ({
      brandid,
      brandname,
    }));

    const brands = _.uniqBy(allBrands, "brandid");
    this.setState({ supplierParts, filteredParts, supplier, brands });
  }
  componentDidMount() {
    this.updateState();
  }
  handleBrandSelect = (brand) => {
    const selectedBrand = brand;
    const { supplierParts } = this.state;

    const filteredParts = supplierParts.filter(
      (m) => selectedBrand.brandid === m.brandid
    );

    this.setState({ filteredParts, selectedBrand, currentPage: 1 });
  };
  renderTitle() {
    const { supplier } = this.state;

    return (
      <div>
        <h3>
          <span className="badge badge-secondary m-2">
            {supplier ? supplier.publishnameen : "Not Found"}
          </span>
          <span className="badge badge-primary m-2">
            <i>{supplier ? supplier.totalparts : "Not Found"}</i>
          </span>
        </h3>
      </div>
    );
  }
  render() {
    const { filteredParts, currentPage, brands } = this.state;

    return (
      <div>
        {this.renderTitle()}
        <div className="row">
          <div className="col-3">
            <div
              className="row-2"
              style={{ height: "30vh", overflowY: "scroll" }}
            >
              <ListGroup
                items={brands}
                textProperty="brandname"
                valueProperty="brandid"
                onItemSelect={this.handleBrandSelect}
                selectedItem={this.state.selectedBrand}
              />
            </div>
          </div>
          <div className="col">
            <DbComponent
              items={filteredParts}
              columns={this.supplierPartsColumns}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
              // newItemLink={`/partform/${category.id}/new`}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default SupplierParts;
