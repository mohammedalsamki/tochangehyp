import React from "react";

import Table from "./common/table";
sfc;
class DbTable extends Component {
  render() {
    const { sortColumn, onSort, items } = this.props;
    return (
      <Table
        columns={this.props.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={items}
      />
    );
  }
}

export default DbTable;
