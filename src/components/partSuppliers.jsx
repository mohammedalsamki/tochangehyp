import React, { Component } from "react";
import { Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
class PartSuppliers extends Component {
  renderPartSupplier(part) {
    const { allowEdit, onSupplierDelete, onDec, onInc } = this.props;
    return (
      <div>
        {part.suppliernameen}
        <span
          className={
            part.status === "new"
              ? "badge badge-success m-4"
              : "badge badge-dark m-4"
          }
        >
          {part.status}
        </span>
        {"  "}
        <span
          className={
            part.numberofparts === "0"
              ? "badge badge-warning m-2"
              : "badge badge-primary m-2"
          }
        >
          {part.numberofparts}
        </span>
        {allowEdit && (
          <div style={{ float: "right" }}>
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onDec(part)}
              >
                -
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onInc(part)}
              >
                +
              </button>
            </div>

            <Button
              variant="outline-danger m-2"
              onClick={() => onSupplierDelete(part)}
            >
              X
            </Button>
          </div>
        )}
      </div>
    );
  }
  render() {
    const { brandPart, allowEdit, onSupplierAdd } = this.props;
    return (
      <div>
        {allowEdit && (
          <Button
            variant="outline-primary m-2"
            onClick={() => onSupplierAdd(brandPart)}
          >
            +
          </Button>
        )}
        <ListGroup>
          {brandPart &&
            brandPart.suppliers.map(
              (part) =>
                part && (
                  <ListGroup.Item
                    key={`${part.supplierid}_${part.partbrandid}_${part.status}`}
                  >
                    {this.renderPartSupplier(part)}
                  </ListGroup.Item>
                )
            )}
        </ListGroup>
      </div>
    );
  }
}
export default PartSuppliers;
