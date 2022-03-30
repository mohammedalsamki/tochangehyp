import React, { Component } from "react";
import { Button } from "react-bootstrap";
class PartVehicles extends Component {
  renderTitle() {
    const { brandPart, onAddVehicle, allowEdit } = this.props;
    return (
      <div>
        <h2>
          <span className="badge badge-primary m-2">
            {brandPart && brandPart.partnameen}
          </span>
          <span className="badge badge-secondary m-2">
            {brandPart && brandPart.brandnameen}
          </span>
          <span className="badge badge-info m-2">
            {brandPart && brandPart.brandpartnameen}
          </span>
          {brandPart && allowEdit && (
            <Button
              variant="outline-primary m-2"
              onClick={() => onAddVehicle(brandPart)}
            >
              +
            </Button>
          )}
        </h2>
      </div>
    );
  }
  renderBrandPartVehicle(v) {
    const { onEditVehicle, onDeleteVehicle, allowEdit } = this.props;
    if (!v) return;
    if (!v.id) return;
    return (
      <div key={v.id}>
        <h3>
          <span className="badge badge-primary m-2">
            {v.manufacturernameen}
          </span>
          <span className="badge badge-secondary m-2">{v.modelnameen}</span>
          <span className="badge badge-info m-2">{v.year1}</span>
          <span className="badge badge-Light m-2">-</span>
          <span className="badge badge-info m-2">{v.year2}</span>
          {allowEdit && (
            <div style={{ float: "right" }}>
              <Button
                variant="outline-warning m-2"
                onClick={() => onEditVehicle(v)}
              >
                ...
              </Button>
              <Button
                variant="outline-danger m-2"
                onClick={() => onDeleteVehicle(v)}
              >
                X
              </Button>
            </div>
          )}
        </h3>
      </div>
    );
  }
  render() {
    const { brandPart } = this.props;
    return (
      <div>
        {this.renderTitle()}
        {brandPart &&
          brandPart.vehicles &&
          brandPart.vehicles.map((v) => this.renderBrandPartVehicle(v))}
      </div>
    );
  }
}
export default PartVehicles;
