import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  getChildCategories,
  getCategory,
  getAllCategories,
  deleteCategory,
} from "../services/phpdbservice";
import DbComponent from "../components/common/dbComponent";
import CategoryNavBar from "../components/categoryNavBar";
import AlertDialog from "../components/common/alertDialog";
import SubCategoryiesList from "../components/subCategoryiesList";
class Categories extends Component {
  categoryColumns = [
    {
      key: "image",
      label: "Image",
      content: (item) => (
        <img src={item.image} style={{ width: 50, height: 50 }} alt={item.id} />
      ),
    },
    {
      path: "nameen",
      label: "Name (EN)",
      content: (item) => (
        <Link to={`/categories/${item.id}`}>{item.nameen}</Link>
      ),
    },
    {
      key: "subCategories",
      label: "Sub Cat",
      content: (item) => (
        <SubCategoryiesList
          allCategories={this.allCategories}
          category={item}
        />
      ),
    },
    {
      key: "totalpartnames",
      label: "Parts",
      content: (item) => (
        <Link
          id={item.id}
          to={`/parts/${item.id}`}
          aria-hidden="true"
          className={
            item.totalpartnames === "0"
              ? "badge badge-warning m-2"
              : "badge badge-primary m-2 "
          }
        >
          {item.totalpartnames}
        </Link>
      ),
    },
    {
      key: "edit",
      content: (item) => (
        <Link
          id={item.id}
          to={`/categoryform/${item.parentid}/${item.id}`}
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
          disabled={
            !(
              item.totalpartnames === "0" &&
              this.NumOfChildCategories(item) === 0
            )
          }
          onClick={() => this.handleButtonDelete(item, item.nameen)}
        >
          X
        </button>
      ),
    },
  ];

  state = {
    pageSize: 10,
    currentPage: 1,
    sortColumn: { path: "id", order: "asc" },
    categories: [],
    category: {
      id: "0",
      nameen: "",
      namear: "",
      parentCategory: { id: "0" },
    },
  };
  async updateState() {
    if (!this.allCategories) this.allCategories = await getAllCategories();
    const { categoryId } = this.parseData();
    const categories = await getChildCategories(categoryId);
    let category = await getCategory(categoryId);

    if (!category)
      category = {
        id: "0",
        nameen: "",
        namear: "",
        parentCategory: { id: "0" },
        parts: [],
      };

    this.setState({ category, categories, currentPage: 1 });
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
    await deleteCategory(this.state.selectedItem);
    delete this.allCategories;
    this.updateState();
  };
  NumOfChildCategories(item) {
    if (!this.allCategories) return 0;
    const subCategories = this.allCategories.filter(
      (c) => c.parentid === item.id
    );
    return subCategories ? subCategories.length : 0;
  }
  handlePartClick = (p) => {};
  parseData() {
    const categoryId = this.props.match.params.parentid || "0";
    return { categoryId };
  }

  async componentDidMount() {
    this.updateState();
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.updateState();
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  renderdbComponent() {
    const { categories, category } = this.state;
    return (
      <div>
        <CategoryNavBar category={category} />
        <DbComponent
          items={categories}
          columns={this.categoryColumns}
          currentPage={this.state.currentPage}
          onPageChange={this.handlePageChange}
          newItemLink={`/categoryform/${category.id}/new`}
          // tableName={"Categories"}
        />
        <AlertDialog
          open={this.state.openDialog}
          onClose={this.handleDialogConfirm}
          message={this.state.dialogMessage}
        />
      </div>
    );
  }

  render() {
    return <div>{this.renderdbComponent()}</div>;
  }
}

export default Categories;
