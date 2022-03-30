import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
class VehicleNavBar extends Component {
  renderManufacturerLink({ manufacturer }) {
    return manufacturer.id === "0" ? null : (
      <Nav.Link href={`/vehicles/${manufacturer.id}`}>
        {manufacturer.nameen}
      </Nav.Link>
    );
  }
  renderModelLink({ manufacturer, model }) {
    return model.id === "0" ? null : (
      <Nav.Link href={`/vehicles/${manufacturer.id}/${model.id}`}>
        {model.modelnameen}
      </Nav.Link>
    );
  }
  renderYearLink({ manufacturer, model, year }) {
    return year.id === "0" ? null : (
      <Nav.Link href={`/vehicles/${manufacturer.id}/${model.id}/${year.id}`}>
        {year.year}
      </Nav.Link>
    );
  }
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Vehicle</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {this.renderManufacturerLink(this.props)}
            {this.renderModelLink(this.props)}
            {this.renderYearLink(this.props)}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default VehicleNavBar;
