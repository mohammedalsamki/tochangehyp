import React, { Component } from "react";
import { Link } from "react-router-dom";
class SubCategoryiesList extends Component {
  state = { subCategories: [] };
  componentDidMount() {
    const { category, allCategories } = this.props;
    const subCategories = allCategories.filter(
      (c) => c.parentid === category.id
    );
    this.setState({ subCategories });
  }
  numOfChildCategories(item) {
    const { allCategories } = this.props;
    if (!allCategories) return 0;
    const subCategories = allCategories.filter((c) => c.parentid === item.id);
    return subCategories ? subCategories.length : 0;
  }
  render() {
    const { subCategories } = this.state;
    return (
      <ul className="list-group">
        {subCategories.map((s) => (
          <li id={s.id} className="list-group-item">
            <img
              src={s.image}
              style={{ width: 30, height: 30 }}
              alt={s.id}
              className="m-2"
            />
            {this.numOfChildCategories(s) > 0 ? (
              <Link to={`/categories/${s.id}`}>{s.nameen}</Link>
            ) : (
              s.nameen
            )}

            <Link
              to={`/parts/${s.id}`}
              aria-hidden="true"
              className={
                s.totalpartnames === "0"
                  ? "badge badge-warning m-2"
                  : "badge badge-primary m-2 "
              }
            >
              {s.totalpartnames}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}

export default SubCategoryiesList;
