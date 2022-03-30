import React from "react";
import Form from "../components/common/form";
import Joi from "joi-browser";
import { getBrand, saveBrand } from "../services/phpdbservice";
class BrandForm extends Form {
  brandSchema = {
    nameen: Joi.string().required().label("Brand Name (EN)"),
    namear: Joi.string().required().label("Brand Name (AR)"),
  };
  schema = this.brandSchema;
  parseData() {
    const brandId = this.props.match.params.brandid || "0";
    return { brandId };
  }
  initializeBrand() {
    this.schema = this.brandSchema;
    this.state.required = { nameen: "", namear: "" };
    this.state.data = { nameen: "", namear: "", logo: "" };
  }
  async componentDidMount() {
    const { brandId } = this.parseData();

    if (brandId === "new") {
      this.initializeBrand();
      return;
    }

    if (brandId === "0") return this.props.history.replace("/not-found");
    const brand = await getBrand(brandId);
    if (!brand) return this.props.history.replace("/not-found");
    const required = {
      nameen: brand.nameen,
      namear: brand.namear,
    };
    this.schema = this.brandSchema;
    this.setState({ data: brand, required });
    return;
  }
  doSubmit = async () => {
    const { brandId } = this.parseData();
    if (brandId === "new" || brandId !== "0") {
      let brand = this.state.data;
      await saveBrand(brand);
      return this.props.history.replace(`/brands`);
    }
  };
  renderMe() {
    const { brandId } = this.parseData();
    if (brandId === "new" || brandId !== "0") return this.renderBrand();
  }
  renderBrand() {
    return (
      <div>
        {this.renderInput("nameen", "Brand Name (EN)")}
        {this.renderInput("namear", "Brand Name (AR)")}
        {this.renderInput("logo", "Brand LOGO")}
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

export default BrandForm;
