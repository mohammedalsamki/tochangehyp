import React, { Component } from "react";
class Selector extends Component {
  getClass() {
    return this.props.selected
      ? "fa fa-angle-double-down"
      : "fa fa-angle-double-right";
  }
  render() {
    return (
      <i
        style={{ cursor: "pointer" }}
        className={this.getClass()}
        aria-hidden="true"
        onClick={this.props.onSelect}
      ></i>
    );
  }
}

export default Selector;
