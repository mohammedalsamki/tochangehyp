import React, { Component } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Image from "react-bootstrap/Image";
import { Badge, Button } from "react-bootstrap";

class VehiclesTreeView extends Component {
  renderManufacturerLabel(manufacturer) {
    const { onManufacurerEdit, onManufacturerDelete, onNewModel } = this.props;
    return (
      <div>
        <h3>
          <Image
            className="m-2"
            rounded
            src={manufacturer.logo}
            style={{ width: 30, height: 30 }}
          />
          <Badge variant="primary m-2">{manufacturer.nameen}</Badge>
          <Button
            variant="outline-warning m-2"
            onClick={() => onManufacurerEdit(manufacturer)}
          >
            ...
          </Button>
          <Button
            variant="outline-danger m-2"
            disabled={manufacturer.models.length > 0}
            onClick={() => onManufacturerDelete(manufacturer)}
          >
            X
          </Button>
          <Button
            variant="outline-primary m-2"
            onClick={() => onNewModel(manufacturer)}
          >
            +
          </Button>
        </h3>
      </div>
    );
  }
  renderModelLabel(model) {
    const { onModelEdit, onModelDelete, onNewYear } = this.props;

    return (
      <div>
        <h3>
          <Badge variant="secondary m-2">{model.nameen}</Badge>
          <Button
            variant="outline-warning m-2"
            onClick={() => onModelEdit(model)}
          >
            ...
          </Button>
          <Button
            variant="outline-danger m-2"
            disabled={model.years.length > 0}
            onClick={() => onModelDelete(model)}
          >
            X
          </Button>
          <Button
            variant="outline-primary m-2"
            onClick={() => onNewYear(model)}
          >
            +
          </Button>
        </h3>
      </div>
    );
  }
  renderYearLabel(year) {
    const { fuelTypes, onYearEdit, onYearDelete } = this.props;
    return (
      <div>
        <h3>
          <Badge variant="primary m-2">{year.year}</Badge>
          <Badge variant="secondary m-2">
            {year.fueltype && fuelTypes[parseInt(year.fueltype)].text}
          </Badge>
          <Badge variant="Light m-2">{year.enginespecs}</Badge>
          <Button
            variant="outline-warning m-2"
            onClick={() => onYearEdit(year)}
          >
            ...
          </Button>
          <Button
            variant="outline-danger m-2"
            onClick={() => onYearDelete(year)}
          >
            X
          </Button>
        </h3>
      </div>
    );
  }
  render() {
    const {
      manufacturers,
      onManufacturerSelect,
      onModelSelect,
      onYearSelect,
    } = this.props;
    return (
      <div style={{ height: "90vh", overflowY: "scroll" }}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {manufacturers &&
            manufacturers.map((manufacturer) => (
              <TreeItem
                nodeId={manufacturer.id}
                key={manufacturer.id}
                label={this.renderManufacturerLabel(manufacturer)}
                onClick={() => onManufacturerSelect(manufacturer)}
              >
                {manufacturer.models &&
                  manufacturer.models.map((model) => (
                    <TreeItem
                      nodeId={`${manufacturer.id}_${model.id}`}
                      key={`${manufacturer.id}_${model.id}`}
                      label={this.renderModelLabel(model)}
                      onClick={() => onModelSelect(model)}
                    >
                      {model.years &&
                        model.years.map((year) => (
                          <TreeItem
                            nodeId={`${manufacturer.id}_${model.id}_${year.id}`}
                            key={`${manufacturer.id}_${model.id}_${year.id}`}
                            label={this.renderYearLabel(year)}
                            onClick={() => onYearSelect(year)}
                          />
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

export default VehiclesTreeView;
