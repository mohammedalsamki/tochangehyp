import React, { Component } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Image from "react-bootstrap/Image";
import { Button } from "react-bootstrap";
class PartsTree extends Component {
  renderPartNameLabel(partName) {
    const {
      allowEdit,
      onNewBrandPart,
      onEditPartName,
      onDeletePartName,
      selectedPartName,
    } = this.props;
    const edit =
      selectedPartName && selectedPartName.id === partName.id && allowEdit;

    return (
      <div>
        <h3>
          <Image
            rounded
            src={partName.image}
            style={{ width: 50, height: 50 }}
          />
          {partName.partnameen}
          {edit && (
            <div style={{ float: "right" }}>
              <Button
                variant="outline-primary m-2"
                onClick={() => onNewBrandPart(partName)}
              >
                +
              </Button>
              <Button
                variant="outline-warning m-2"
                onClick={() => onEditPartName(partName)}
              >
                ...
              </Button>

              <Button
                variant="outline-danger m-2"
                onClick={() => onDeletePartName(partName)}
                disabled={partName.brands.length > 0}
              >
                X
              </Button>
            </div>
          )}
        </h3>
      </div>
    );
  }
  renderPartBrandLabel(br) {
    return (
      <div>
        <h3>
          <Image rounded src={br.logo} style={{ width: 40, height: 40 }} />
          {br.nameen}
        </h3>
      </div>
    );
  }
  renderPartNameBrandPartLabel(brp) {
    const {
      selectedBrandPart,
      onEditBrandPart,
      onDeleteBrandPart,
      allowEdit,
    } = this.props;
    const edit =
      selectedBrandPart && selectedBrandPart.id === brp.id && allowEdit;

    return (
      <div>
        <h2>
          <Image rounded src={brp.image} style={{ width: 40, height: 40 }} />
          <span className="badge badge-light m-2">
            {brp.manufacturerpartno}
          </span>
          <span className="badge badge-primary m-2">{brp.nameen}</span>
          {edit && (
            <div style={{ float: "right" }}>
              <Button
                variant="outline-warning m-2"
                onClick={() => onEditBrandPart(brp)}
              >
                ...
              </Button>

              <Button
                variant="outline-danger m-2"
                onClick={() => onDeleteBrandPart(brp)}
                disabled={brp.vehicles.length > 0}
              >
                X
              </Button>
            </div>
          )}
        </h2>
      </div>
    );
  }
  render() {
    const {
      category,
      onBrandPartSelect,
      onPartNameSelect,
      onBrandSelect,
      allowEdit,
      onNewPartName,
    } = this.props;
    return (
      <div style={{ height: "100vh", overflowY: "scroll" }}>
        {allowEdit && category && (
          <Button
            variant="outline-primary m-2"
            onClick={() => onNewPartName(category)}
          >
            +
          </Button>
        )}
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {category &&
            category.parts &&
            category.parts.map((pn) => (
              <TreeItem
                nodeId={pn.id}
                key={pn.id}
                label={this.renderPartNameLabel(pn)}
                onClick={() => onPartNameSelect(pn)}
              >
                {pn.brands &&
                  pn.brands.map(
                    (br) =>
                      br && (
                        <TreeItem
                          nodeId={`${pn.id}_${br.id}`}
                          key={`${pn.id}_${br.id}`}
                          label={this.renderPartBrandLabel(br)}
                          onClick={() => onBrandSelect(br)}
                        >
                          {br.brandParts &&
                            br.brandParts.map((brp) => (
                              <TreeItem
                                nodeId={`${pn.id}_${br.id}_${brp.id}`}
                                key={`${pn.id}_${br.id}_${brp.id}`}
                                label={this.renderPartNameBrandPartLabel(brp)}
                                onClick={() => onBrandPartSelect(brp)}
                              ></TreeItem>
                            ))}
                        </TreeItem>
                      )
                  )}
              </TreeItem>
            ))}
        </TreeView>
      </div>
    );
  }
}
export default PartsTree;
