import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getSuppliers } from "../services/phpdbservice";
import DbComponent from "../components/common/dbComponent";

class Suppliers extends Component {
  supplierColumns = [
    {
      path: "id",
      label: "Supplier ID",
    },
    {
      path: "publishnameen",
      label: "Name (EN)",
    },
    {
      path: "publishnamear",
      label: "Name (AR)",
    },
    {
      key: "totalparts",
      label: "Parts",
      content: (item) => (
        <Link
          to={`/supplierparts/${item.id}/`}
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
  ];

  state = { suppliers: [], currentPage: 1 };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  async updateState() {
    const suppliers = await getSuppliers();
    this.setState({ suppliers });
  }
  componentDidMount() {
    this.updateState();
  }

  render() {
    return (
      <DbComponent
        items={this.state.suppliers}
        columns={this.supplierColumns}
        currentPage={this.state.currentPage}
        onPageChange={this.handlePageChange}
        // newItemLink={`/brandpartform/${this.props.match.params.brandid}/${this.props.match.params.partnameid}/new`}
      />
    );
  }
}

export default Suppliers;
