import React, { Component } from "react";
import CategoriesTree from "../components/categoriesTree";
import PartsTree from "../components/partsTree";
import SupplierPart from "./supplierPart";
import BrandsDropDown from "./brandsDropDown";
import { getCurrentUser } from "../services/userService";
import _ from "lodash";
import { getAllParts, setNumOfParts } from "../services/phpdbservice";
import { getBaseCategories, getCategoryParts } from "../utils/categories";
class PartNames extends Component {
  state = {
    // user: {},
    categories: [],
    allParts: [],
    parts: [],
    allBrandParts: [],
    allSupplierParts: [],
    brands: [],
    brandPart: null,
    // partName: null,
    mainBrand: { brandid: "0", brandnameen: " All Brands" },
    category: null,
  };
  getCategoriesOfId(categories, id) {
    return;
  }

  async componentDidMount() {
    const user = getCurrentUser();
    const allParts = await getAllParts();
    const categories = await getBaseCategories();
    let supplierParts = allParts;

    if (user.authorization === "supplier")
      supplierParts = allParts.filter((p) => p.supplierid === user.id);
    let brands = _.uniqBy(supplierParts, "brandid");

    brands.push({ brandid: "0", brandnameen: " All Brands" });
    brands = _.orderBy(brands, ["brandnameen"], ["asc"]);
    this.setState({
      categories,
      allParts,
      supplierParts,
      brands,
    });
  }
  handleCategorySelect = (category) => {
    const parts = getCategoryParts(
      category,
      this.state.mainBrand,
      this.state.supplierParts
    );
    this.setState({ parts, category, brandPart: null });
  };
  handleBrandPartSelect = (brandPart) => {
    this.setState({ brandPart });
  };
  handlePartNameSelect = (partName) => {
    this.setState({ brandPart: null });
  };
  handleBrandSelect = (brand) => {
    this.setState({ brandPart: null });
  };
  handleMainBrandSelect = (e, { value }) => {
    const brand = this.state.brands.find((br) => br.brandid === value);
    const parts = getCategoryParts(
      this.state.category,
      brand,
      this.state.supplierParts
    );
    this.setState({ parts, mainBrand: brand, brandPart: null });
  };
  handleSupplierPartInc = (supplierPart) => {
    const { brandPart } = this.state;
    let num = parseInt(supplierPart.numberofparts);
    num += 1;
    const sup = brandPart.suppliers.find(
      (s) =>
        s.supplierid === supplierPart.supplierid &&
        s.status === supplierPart.status
    );
    if (!sup) return;
    brandPart.suppliers[brandPart.suppliers.indexOf(sup)].numberofparts = num;
    setNumOfParts(sup, num);
    this.setState({ brandPart });
  };
  handleSupplierPartDec = (supplierPart) => {
    const { brandPart } = this.state;
    let num = parseInt(supplierPart.numberofparts);
    if (num <= 0) return;
    num -= 1;
    const sup = brandPart.suppliers.find(
      (s) =>
        s.supplierid === supplierPart.supplierid &&
        s.status === supplierPart.status
    );
    if (!sup) return;
    brandPart.suppliers[brandPart.suppliers.indexOf(sup)].numberofparts = num;
    setNumOfParts(sup, num);
    this.setState({ brandPart });
  };
  render() {
    const {
      allParts,
      categories,
      parts,
      brandPart,
      //   partName,
      //   brand,
      brands,
    } = this.state;
    return (
      <div className="row">
        <div className="col-3">
          <CategoriesTree
            categories={categories}
            parts={allParts}
            onSelect={this.handleCategorySelect}
          />
        </div>
        <div className="col-4">
          <BrandsDropDown
            brands={brands}
            onSelect={this.handleMainBrandSelect}
          />
          <PartsTree
            parts={parts}
            onBrandPartSelect={this.handleBrandPartSelect}
            onPartNameSelect={this.handlePartNameSelect}
            onBrandSelect={this.handleBrandSelect}
          />
        </div>
        <div className="col">
          <SupplierPart
            brandPart={brandPart}
            onInc={this.handleSupplierPartInc}
            onDec={this.handleSupplierPartDec}
          />
        </div>
      </div>
    );
  }
}
export default PartNames;
