import React from "react";
import Form from "../components/common/form";
import Joi from "joi-browser";
import {
  getBrands,
  getPartNames,
  getAllBrandParts,
  saveBrandPart,
} from "../services/phpdbservice";
class BrandPartForm extends Form {
  schema = {
    partnameid: Joi.number().required().label("Part Name"),
    brandid: Joi.number().required().label("Brand"),
    manufacturerpartno: Joi.string().required().label("Part No"),
    nameen: Joi.string().required().label("Name (EN)"),
  };

  partNames = [];
  brands = [];
  parseData() {
    const brandId = this.props.match.params.brandid || "0";
    const partnameId = this.props.match.params.partnameid || "0";
    const partId = this.props.match.params.partid || "0";
    const currentPage = this.props.match.params.currentpage || "1";
    return { partnameId, brandId, partId, currentPage };
  }
  async componentDidMount() {
    const { brandId, partnameId, partId } = this.parseData();
    this.brands = await getBrands();
    this.partNames = await getPartNames();
    this.brandParts = await getAllBrandParts();

    if (partId === "new") {
      const required = {
        brandid: brandId,
        partnameid: partnameId,
        manufacturerpartno: "",
        nameen: "",
      };
      const data = {
        brandid: brandId,
        partnameid: partnameId,
        manufacturerpartno: "",
        nameen: "",
        namear: "",
        image: "",
      };
      this.setState({ data, required });
      return;
    }

    if (partId === "0") return this.props.history.replace("/not-found");
    const brandPart = this.brandParts.find((p) => p.id === partId);
    if (!brandPart) return this.props.history.replace("/not-found");
    const required = {
      partnameid: brandPart.partnameid,
      brandid: brandPart.brandid,
      manufacturerpartno: brandPart.manufacturerpartno,
      nameen: brandPart.nameen,
    };
    this.setState({ data: brandPart, required });
  }
  doSubmit = async () => {
    const { brandId, partnameId, partId, currentPage } = this.parseData();

    if (partId === "new" || partId !== "0") {
      const brandPart = this.state.data;
      await saveBrandPart(brandPart);
      return this.props.history.replace(
        `/brandparts/${brandId}/${partnameId}/${currentPage}`
      );
    }
  };
  renderMe() {
    const { partnameId, brandId, partId } = this.parseData();
    if (partId === "new" || partId !== "0")
      return (
        <div>
          {this.renderSelect(
            "partnameid",
            "Part Name",
            this.partNames,
            "partnameen",
            partnameId
          )}
          {this.renderSelect(
            "brandid",
            "Brand",
            this.brands,
            "nameen",
            brandId
          )}
          {this.renderInput("manufacturerpartno", "Manufacturer Part No")}
          {this.renderInput("nameen", "Part Name (EN)")}
          {this.renderInput("namear", "Part Name (AR)")}
          {this.renderInput("image", "Image")}
        </div>
      );
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

export default BrandPartForm;
