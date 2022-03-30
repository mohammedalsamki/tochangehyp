import React from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { isEmpty } from "lodash";
const Navigation = ({ logo, user, allowEdit, onAllowEdit }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand to="/">
        <img src={logo} style={{ width: 50, height: 50 }} alt={"ToChange"} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">To Change</Nav.Link>
          {user.authorization === "administrator" && (
            <NavDropdown title="Database" id="basic-nav-dropdown">
              <NavDropdown.Item href="/vehicles">Vehicles</NavDropdown.Item>
              <NavDropdown.Item href="/brands">Brands</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/linkparts">Parts</NavDropdown.Item>
            </NavDropdown>
          )}
          {user.authorization === "tcbtadmin" && (
            <NavDropdown title="Devices" id="basic-nav-dropdown">
              <NavDropdown.Item href="/tcbt/1">TCBT8Ch</NavDropdown.Item>
              <NavDropdown.Item href="/tcbt/2">TCBT8ChV2.0</NavDropdown.Item>
              <NavDropdown.Item href="/tcbt/3">TCBT8ChV2.1</NavDropdown.Item>
              <NavDropdown.Item href="/tcbt/4">TCBT16Ch</NavDropdown.Item>
            </NavDropdown>
          )}

          {isEmpty(user.authorization) && (
            <Nav.Link href="/login">Login</Nav.Link>
          )}
          {!isEmpty(user.authorization) && (
            <React.Fragment>
              <Navbar.Brand>{user.username}</Navbar.Brand>
              <Nav.Link href="/logout">Logout</Nav.Link>
            </React.Fragment>
          )}
        </Nav>
      </Navbar.Collapse>
      {
        <Form>
          {user.authorization === "administrator" && (
            <Form.Check
              type="switch"
              id="custom-switch"
              inline={true}
              label="Edit"
              checked={allowEdit}
              style={{ cursor: "pointer", float: "right" }}
              onChange={onAllowEdit}
            />
          )}
        </Form>
      }
    </Navbar>
  );
};
export default Navigation;
