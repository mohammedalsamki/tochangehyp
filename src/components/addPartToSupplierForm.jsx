import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import {
  getAllSuppliers,
  getSupplierParts,
  saveSupplierPart,
} from "../services/phpdbservice";
class AddPartToSupplierForm extends Form {
  schema = {
    partbrandid: Joi.string().required().label("Supplier"),
  };

  parseData() {
    const brandPartId = this.props.match.params.brandpartid || "0";
    const brandId = this.props.match.params.brandid || "0";
    const partnameId = this.props.match.params.partnameid || "0";
    const currentPage = this.props.match.params.currentpage || "1";
    return { brandPartId, brandId, partnameId, currentPage };
  }
  async componentDidMount() {
    const { brandPartId } = this.parseData();
    const required = {
      partbrandid: brandPartId,
    };
    const data = { partbrandid: brandPartId, supplierid: "1", status: "new" };

    const suppliers = await getAllSuppliers();

    this.setState({ suppliers, data, required });
  }
  doSubmit = async () => {
    const { brandPartId, brandId, partnameId, currentPage } = this.parseData();
    const { supplierid, status, partbrandid } = this.state.data;
    const supplierParts = await getSupplierParts({
      id: supplierid,
    });
    const partExisted = supplierParts.filter(
      (p) =>
        p.supplierid === supplierid &&
        p.status === status &&
        p.partbrandid === brandPartId
    );
    const supplierName = this.state.suppliers.filter(
      (s) => s.id === supplierid
    );
    if (partExisted.length > 0) {
      alert(`${supplierName[0].publishnameen} has this part`);
    } else {
      await saveSupplierPart({ supplierid, status, partbrandid });
    }
    return this.props.history.replace(
      `/brandparts/${brandId}/${partnameId}/${currentPage}`
    );

    // await saveBrandPart(brandPart);
  };
  renderMe() {
    console.log("suppliers", this.state.suppliers);

    return (
      <div>
        {this.renderSelect(
          "supplierid",
          "Supplier",
          this.state.suppliers || [],
          "publishnameen",
          "1"
        )}
        {this.renderSelect(
          "status",
          "Status",
          [{ id: "new" }, { id: "used" }],
          "id",
          0
        )}
      </div>
    );
    // if (brandId === "new" || brandId !== "0") return this.renderBrand();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <main className="container">
          {this.renderMe()}
          {this.renderButton("Save")}
        </main>
      </form>
    );
  }
}

export default AddPartToSupplierForm;
