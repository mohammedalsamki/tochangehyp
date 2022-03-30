import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { getAllCategories } from "../services/phpdbservice";
class CategoryNavBar extends Component {
  categories = [];
  renderLink(category) {
    return category ? (
      <Nav.Link href={`/categories/${category.id}`}>{category.nameen}</Nav.Link>
    ) : null;
  }
  async componentDidMount() {
    this.categories = await getAllCategories();
  }
  getParent(category) {
    return this.categories.find((m) => m.id === category.parentid);
  }
  getHirarchy() {
    let category = this.props.category;
    const hirarchy = [category];
    while (category && category.parentid !== "0") {
      category = this.getParent(category);
      hirarchy.push(category);
    }

    return hirarchy;
  }
  renderHirarchyLinks() {
    const hirarchy = this.getHirarchy().reverse();
    return (
      <Nav className="mr-auto">{hirarchy.map((c) => this.renderLink(c))}</Nav>
    );
  }
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/categories/">Category</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {this.renderHirarchyLinks()}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default CategoryNavBar;
