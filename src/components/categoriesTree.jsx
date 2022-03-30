import React, { Component } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Image from "react-bootstrap/Image";
import { Button } from "react-bootstrap";
import { getCategoryParts } from "../utils/categories";
class CategoriesTree extends Component {
  // state = { allowEdit: false };
  renderNewButton(category) {
    const { onNewCategory } = this.props;
    return (
      <Button
        variant="outline-primary m-2"
        onClick={() => onNewCategory(category)}
      >
        +
      </Button>
    );
  }
  renderEditButton(category) {
    const { onEditCategory } = this.props;
    return (
      <Button
        variant="outline-warning m-2"
        onClick={() => onEditCategory(category)}
      >
        ...
      </Button>
    );
  }
  renderDeleteButton(category) {
    const { onDeleteCategory, allParts } = this.props;
    const categoryParts = getCategoryParts(category, null, allParts);
    // getCategoryPartNames(category, allParts);
    // allParts.filter((p) => p.categoryid === category.id);
    return (
      <Button
        variant="outline-danger m-2"
        onClick={() => onDeleteCategory(category)}
        disabled={category.subCategories.length > 0 || categoryParts.length > 0}
      >
        X
      </Button>
    );
  }
  renderCategoryLabel(category) {
    const { allowEdit, selectedCategory } = this.props;
    const edit =
      selectedCategory && selectedCategory.id === category.id && allowEdit;
    return (
      <div>
        <h3>
          <Image
            rounded
            src={category.image}
            style={{ width: 30, height: 30, margin: 5 }}
          />
          {category.nameen}
          {edit && (
            <div style={{ float: "right" }}>
              {this.renderNewButton(category)}
              {this.renderEditButton(category)}
              {this.renderDeleteButton(category)}
            </div>
          )}
        </h3>
      </div>
    );
  }

  render() {
    const { categories, onSelect, allowEdit } = this.props;
    return (
      <div style={{ height: "90vh", overflowY: "scroll" }}>
        {allowEdit && this.renderNewButton(null)}
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {categories.map((c) => (
            <TreeItem
              nodeId={c.id}
              key={c.id}
              label={this.renderCategoryLabel(c)}
              onClick={() => onSelect(c)}
            >
              {c.subCategories &&
                c.subCategories.map((sc) => (
                  <TreeItem
                    nodeId={sc.id}
                    key={sc.id}
                    label={this.renderCategoryLabel(sc)}
                    onClick={() => onSelect(sc)}
                  >
                    {sc.subCategories &&
                      sc.subCategories.map((ssc) => (
                        <TreeItem
                          nodeId={ssc.id}
                          key={ssc.id}
                          label={this.renderCategoryLabel(ssc)}
                          onClick={() => onSelect(ssc)}
                        ></TreeItem>
                      ))}
                  </TreeItem>
                ))}
            </TreeItem>
          ))}
        </TreeView>
      </div>
    );
  }
}
export default CategoriesTree;
