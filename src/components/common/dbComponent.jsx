import React, { Component } from "react";
import Pagination from "./pagination";
import { paginate } from "../../utils/paginate";
import FormattedNo from "./formatted-no";
import Table from "./table";
import { Link } from "react-router-dom";
import _ from "lodash";

class DbComponent extends Component {
  state = {
    pageSize: 10,
    sortColumn: { path: "id", order: "asc" },
  };
  componentDidMount() {
    const { items } = this.props;
    this.setState({ items });
  }

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  getPagedData(items) {
    const { pageSize, sortColumn } = this.state;
    const { currentPage } = this.props;
    const sorted = _.orderBy(items, [sortColumn.path], [sortColumn.order]);

    const pageItems = paginate(sorted, currentPage, pageSize);
    return { totalCount: items.length, data: pageItems };
  }
  render() {
    const { pageSize, sortColumn } = this.state;
    const {
      items,
      currentPage,
      onPageChange,
      newItemLink,
      tableName,
    } = this.props;

    const { totalCount, data } = this.getPagedData(items);
    return (
      <div className="row">
        <div className="col">
          <h1 style={{ textAlign: "center" }}>
            <span class="badge badge-secondary m-2">{tableName}</span>
          </h1>
          {newItemLink ? (
            <Link
              to={newItemLink}
              className="btn btn-primary m-2"
              style={{ marginBottom: 20 }}
            >
              New...
            </Link>
          ) : null}
          Showing <FormattedNo val={data.length} /> Items of
          <FormattedNo val={totalCount} />
          {items.length !== 0 ? (
            <div>
              <Table
                columns={this.props.columns}
                data={data}
                sortColumn={sortColumn}
                onDelete={this.handleDelete}
                onSelect={this.props.onSelect}
                onSort={this.handleSort}
              />
              <Pagination
                itemsCount={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            </div>
          ) : (
            <p>Database is Empty</p>
          )}
        </div>
      </div>
    );
  }
}

export default DbComponent;
