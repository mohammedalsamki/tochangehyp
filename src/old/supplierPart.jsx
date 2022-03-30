import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import { getCurrentUser } from "../services/userService";

class SupplierPart extends Component {
  render() {
    const { brandPart, onInc, onDec } = this.props;
    const user = getCurrentUser();
    return (
      <div>
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
          </h2>
        </div>
        {brandPart &&
          brandPart.suppliers &&
          brandPart.suppliers.map((brps) => (
            <h2 key={`${brps.brandpartnameen}_${brps.status}`}>
              <span className="badge badge-secondary m-2">
                {brps.supplierid}
              </span>
              <span
                className={
                  brps.status === "used"
                    ? "badge badge-dark m-2"
                    : "badge badge-primary m-2"
                }
              >
                {brps.status}
              </span>
              <span
                className={
                  parseInt(brps.numberofparts) === 0
                    ? "badge badge-warning m-2"
                    : "badge badge-info m-2"
                }
              >
                {brps.numberofparts}
              </span>
              {user && user.authorization === "supplier" && (
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onDec(brps)}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onInc(brps)}
                  >
                    +
                  </button>
                </div>
              )}
            </h2>
          ))}
        <div>
          {brandPart && (
            <Image
              rounded
              src={brandPart.brandpartimage}
              style={{ width: 400, height: 400 }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default SupplierPart;
