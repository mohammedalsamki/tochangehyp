import React, { Component } from "react";
import {
  getCategoryParts,
  getCategory,
  deletePartName,
} from "../services/phpdbservice";
import CategoryNavBar from "./categoryNavBar";
import { Link } from "react-router-dom";
import DbComponent from "../components/common/dbComponent";
import AlertDialog from "../components/common/alertDialog";
class Parts extends Component {
  partColumns = [
    {
      path: "partnameen",
      label: "Part Name (EN)",
    },
    {
      path: "partnamear",
      label: "Part Name (AR)",
    },
    {
      key: "image",
      label: "Image",
      content: (item) => (
        <img src={item.image} style={{ width: 50, height: 50 }} alt={item.id} />
      ),
    },
    {
      key: "totalitems",
      label: "Brand Items",
      content: (item) => (
        <Link
          to={`/brandparts/0/${item.id}`}
          className={
            item.totalitems === "0"
              ? "badge badge-warning m-2"
              : "badge badge-primary m-2 "
          }
        >
          {item.totalitems}
        </Link>
      ),
    },
    {
      key: "edit",
      content: (item) => (
        <Link
          to={`/partform/${item.categoryid}/${item.id}`}
          className="btn btn-primary btn-sm "
        >
          ...
        </Link>
      ),
    },
    {
      key: "delete",
      content: (item) => (
        <button
          className="btn btn-danger btn-sm "
          disabled={!(item.totalitems === "0")}
          onClick={() => this.handleButtonDelete(item, item.partnameen)}
        >
          X
        </button>
      ),
    },
  ];
  state = {
    pageSize: 10,
    currentPage: 1,
    category: {},
    sortColumn: { path: "id", order: "asc" },
    parts: [],
  };
  parseData() {
    const categoryId = this.props.match.params.categoryid || "0";
    return { categoryId };
  }
  async updateState() {
    const { categoryId } = this.parseData();
    const category = await getCategory(categoryId);
    if (!category) return this.props.history.replace("/not-found");
    const parts = await getCategoryParts(category);
    this.setState({ category, parts });
  }

  handleButtonDelete(item, label) {
    this.setState({
      openDialog: true,
      dialogMessage: `Delete ${label} permanently from database`,
      selectedItem: item,
    });
  }
  handleDialogConfirm = async (m) => {
    if (m === "0") {
      this.setState({ openDialog: false });
      return;
    }
    this.state.openDialog = false;
    delete this.state.parts;
    deletePartName(this.state.selectedItem);
    this.updateState();
  };

  componentDidMount() {
    delete this.state.parts;
    this.updateState();
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const { category, parts, currentPage } = this.state;
    return (
      <div>
        <CategoryNavBar category={category} />
        <DbComponent
          items={parts}
          columns={this.partColumns}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
          newItemLink={`/partform/${category.id}/new`}
        />
        <AlertDialog
          open={this.state.openDialog}
          onClose={this.handleDialogConfirm}
          message={this.state.dialogMessage}
        />
      </div>
    );
  }
}

export default Parts;
