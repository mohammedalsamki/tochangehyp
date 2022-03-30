import React from "react";
import Form from "../components/common/form";
import Joi from "joi-browser";
import { getPartName, savePart } from "../services/phpdbservice";
class PartForm extends Form {
  schema = {
    partnameen: Joi.string().required().label("Part Name (EN)"),
    partnamear: Joi.string().required().label("Part Name (AR)"),
    categoryid: Joi.number().required().label("Part Name (AR)"),
  };
  parseData() {
    const categoryId = this.props.match.params.categoryid || "0";
    const partId = this.props.match.params.partid || "0";

    return { categoryId, partId };
  }
  async componentDidMount() {
    const { categoryId, partId } = this.parseData();
    console.log("partid", partId);

    if (partId === "new") {
      const required = {
        partnameen: "",
        partnamear: "",
        categoryid: categoryId,
      };
      const data = {
        partnameen: "",
        partnamear: "",
        categoryid: categoryId,
        image: "",
      };
      this.setState({ data, required });
      return;
    }

    if (partId === "0") return this.props.history.replace("/not-found");
    const part = await getPartName(partId);
    console.log("part", part);

    if (!part) return this.props.history.replace("/not-found");
    const required = {
      partnameen: part.partnameen,
      partnamear: part.partnamear,
      categoryid: categoryId,
    };
    this.setState({ data: part, required });
  }
  doSubmit = async () => {
    const { partId } = this.parseData();
    if (partId === "new" || partId !== "0") {
      let part = this.state.data;
      await savePart(part);
      return this.props.history.replace(`/parts/${part.categoryid}`);
    }
  };
  renderMe() {
    const { partId } = this.parseData();
    if (partId === "new" || partId !== "0")
      return (
        <div>
          {this.renderInput("categoryid", "Category ID")}
          {this.renderInput("partnameen", "Part Name (EN)")}
          {this.renderInput("partnamear", "Part Name (AR)")}
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

export default PartForm;
