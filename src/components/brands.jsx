import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getBrands, deleteBrand } from "../services/phpdbservice";
import DbComponent from "./common/dbComponent";
import AlertDialog from "./common/alertDialog";
class Brands extends Component {
  brandColumns = [
    {
      path: "nameen",
      label: "Name (EN)",
    },
    {
      path: "namear",
      label: "Name (AR)",
    },
    {
      key: "logo",
      label: "Logo",
      content: (item) => (
        <img src={item.logo} style={{ width: 50, height: 50 }} alt={item.id} />
      ),
    },
    {
      key: "totalparts",
      label: "Parts",
      content: (item) => (
        <Link
          to={`/brandparts/${item.id}/0`}
          className={
            item.totalparts === "0"
              ? "badge badge-warning m-2"
              : "badge badge-primary m-2 "
          }
        >
          {item.totalparts}
        </Link>
      ),
    },
    {
      key: "edit",
      content: (item) => (
        <Link to={`/brandform/${item.id}`} className="btn btn-primary btn-sm ">
          ...
        </Link>
      ),
    },
    {
      key: "delete",
      content: (item) => (
        <button
          className="btn btn-danger btn-sm "
          disabled={!(item.totalparts === "0")}
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
    brands: [],
    brand: { id: "0", nameen: "", namear: "" },
  };
  parseData() {
    const brandId = this.props.match.params.brandid || "0";
    return { brandId };
  }
  async updateState() {
    const { brandId } = this.parseData();
    const brands = await getBrands();
    if (brandId === "0") {
      this.setState({ brands });
      return;
    }
  }

  componentDidMount() {
    this.updateState();
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
    await deleteBrand(this.state.selectedItem);
    this.state.brands = [];
    this.updateState();
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  renderdbComponent() {
    const { brand, brands } = this.state;
    if (brand.id === "0") {
      return (
        <DbComponent
          items={brands}
          columns={this.brandColumns}
          currentPage={this.state.currentPage}
          onPageChange={this.handlePageChange}
          newItemLink={"/brandform/new"}
          tableName="Brands"
        />
      );
    }
  }
  render() {
    return (
      <div>
        {this.renderdbComponent()}
        <AlertDialog
          open={this.state.openDialog}
          onClose={this.handleDialogConfirm}
          message={this.state.dialogMessage}
        />
      </div>
    );
  }
}

export default Brands;
