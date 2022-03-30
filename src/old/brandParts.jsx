import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  getAllBrandParts,
  getAllSuppliersParts,
  deleteSupplierPart,
  deleteBrandPart,
} from "../services/phpdbservice";
import DbComponent from "../components/common/dbComponent";
import PartSuppliers from "../components/partSuppliers";
import AlertDialog from "../components/common/alertDialog";
class BrandParts extends Component {
  brandPartColumns = [
    {
      path: "partnameen",
      label: "PN Name(EN)",
      content: (item) => (
        <div>
          <Link to={`/parts/${item.categoryid}`}>{" << "}</Link>
          <Link
            to={`/brandparts/${this.props.match.params.brandid}/${item.partnameid}`}
          >
            {item.partnameen}
          </Link>
        </div>
      ),
    },

    {
      path: "brandnameen",
      label: "Brand ",
      content: (item) => (
        <div>
          <Link to={`/brands`}>{" << "}</Link>
          <Link
            to={`/brandparts/${item.brandid}/${this.props.match.params.partnameid}`}
          >
            {item.brandnameen}
          </Link>
        </div>
      ),
    },

    {
      path: "nameen",
      label: "Name (EN)",
    },
    {
      path: "manufacturerpartno",
      label: "Part No",
    },

    {
      key: "image",
      label: "Image",
      content: (item) => (
        <img src={item.image} style={{ width: 80, height: 80 }} alt={item.id} />
      ),
    },

    {
      key: "supplierscnt",
      label: "Suppliers",
      content: (item) => (
        <PartSuppliers
          brandPart={item}
          suppliersParts={this.state.suppliersParts}
          onDelete={this.handleSupplierPartDelete}
        />
      ),
    },
    {
      key: "addpart",
      content: (item) => (
        <Link
          to={`/addparttosupplier/${item.id}/${this.props.match.params.brandid}/${this.props.match.params.partnameid}/${this.state.currentPage}`}
          className="btn btn-primary btn-sm "
        >
          +
        </Link>
      ),
    },

    {
      key: "edit",
      content: (item) => (
        <Link
          to={`/brandpartform/${this.props.match.params.brandid}/${this.props.match.params.partnameid}/${item.id}/${this.state.currentPage}`}
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
          disabled={!(item.totalsuppliers === "0")}
          onClick={() =>
            this.handleButtonDelete(
              item,
              `${item.brandnameen} - ${item.partnameen} `
            )
          }
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
    brandParts: [],
    brand: { id: "0", nameen: "", namear: "" },
    suppliersParts: [],
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
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
    delete this.state.brandParts;
    deleteBrandPart(this.state.selectedItem);
    this.updateState();
  };
  handleSupplierPartDelete = async (part) => {
    await deleteSupplierPart(part);
    this.state.brandParts = [];
    this.updateState();
  };
  parseData() {
    const brandId = this.props.match.params.brandid || "0";
    const partnameId = this.props.match.params.partnameid || "0";
    const currentPage = this.props.match.params.currentpage || "1";

    return { brandId, partnameId, currentPage };
  }
  async updateState() {
    const { brandId, partnameId, currentPage } = this.parseData();
    const suppliersParts = await getAllSuppliersParts();
    let allBrandParts = await getAllBrandParts();
    let brandParts = allBrandParts;

    if (brandId !== "0") {
      brandParts = allBrandParts.filter((b) => b.brandid === brandId);
      allBrandParts = brandParts;
    }
    if (partnameId !== "0") {
      brandParts = allBrandParts.filter((b) => b.partnameid === partnameId);
    }
    this.setState({ brandParts, suppliersParts, currentPage });
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      // this.brandParts = [];
      this.updateState();
    }
  }
  async componentDidMount() {
    // this.brandParts = [];
    this.updateState();
  }

  renderdbComponent() {
    const { brandParts } = this.state;

    return (
      <DbComponent
        items={brandParts}
        columns={this.brandPartColumns}
        currentPage={this.state.currentPage}
        onPageChange={this.handlePageChange}
        newItemLink={`/brandpartform/${this.props.match.params.brandid}/${this.props.match.params.partnameid}/new`}
      />
    );
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

export default BrandParts;
