import React, { Component } from "react";

class EnhancedListGroup extends Component {
  render() {
    const {
      items,
      selectedItem,
      valueProperty,
      onItemSelect,
      contents,
    } = this.props;
    if (!items) return null;
    return (
      <ul className="list-group">
        {items.map((item) => (
          <li
            key={item[valueProperty]}
            style={{ cursor: "pointer" }}
            onClick={() => onItemSelect(item)}
            className={
              selectedItem &&
              selectedItem[valueProperty] === item[valueProperty]
                ? "list-group-item active"
                : "list-group-item"
            }
          >
            <div className="row">{contents.map((c) => c.content(item))}</div>
          </li>
        ))}
      </ul>
    );
  }
}

export default EnhancedListGroup;
