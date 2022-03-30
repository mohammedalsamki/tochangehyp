import React from "react";
import Form from "../components/common/form";
import Joi from "joi-browser";
import { getCategory, saveCategory } from "../services/phpdbservice";
class CategoryForm extends Form {
  schema = {
    nameen: Joi.string().required().label("Category Name (EN)"),
    namear: Joi.string().required().label("Category Name (AR)"),
    parentid: Joi.number().required().label("Parent ID"),
  };
  state = {
    data: { nameen: "", namear: "", parentid: "", image: "" },
    required: { nameen: "", namear: "", parentid: "" },
    errors: {},
  };
  categories = [];

  parseData() {
    const parentId = this.props.match.params.parentid || "0";
    const categoryId = this.props.match.params.categoryid || "0";
    return { parentId, categoryId };
  }
  async componentDidMount() {
    const { parentId, categoryId } = this.parseData();
    const required = this.state.required;
    const data = this.state.data;

    if (categoryId === "new") {
      data.parentid = parentId;
      required.parentid = parentId;
      this.setState({ data, required });
      return;
    }
    const category = await getCategory(categoryId);
    if (!category) return this.props.history.replace("/not-found");

    required.nameen = category.nameen;
    required.namear = category.namear;
    required.parentid = category.parentid;

    this.setState({ data: category, required });
    return;
  }
  doSubmit = async () => {
    const { categoryId } = this.parseData();
    if (categoryId === "new" || categoryId !== "0") {
      let category = this.state.data;
      await saveCategory(category);
      return this.props.history.replace(`/categories/${category.parentid}`);
    }
  };
  renderMe() {
    const { brandId } = this.parseData();
    if (brandId === "new" || brandId !== "0") return this.renderBrand();
  }
  renderBrand() {
    return (
      <div>
        {this.renderInput("parentid", "Parent ID")}
        {this.renderInput("nameen", "Category Name (EN)")}
        {this.renderInput("namear", "Category Name (AR)")}
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

export default CategoryForm;
