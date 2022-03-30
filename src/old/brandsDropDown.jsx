import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import { Dropdown } from "semantic-ui-react";
class BrandsDropDown extends Component {
  renderBrand(brand) {
    return (
      <React.Fragment>
        <h3>
          <Image
            // rounded
            src={brand.brandlogo}
            style={{ width: 40, height: 40 }}
          />
          <span className="badge badge-light m-2">{brand.brandnameen}</span>
        </h3>
      </React.Fragment>
    );
  }

  getBrandsOptions(brands) {
    return brands.map((br) => ({
      key: br.brandnameen,
      text: this.renderBrand(br),
      value: br.brandid,
      // image: { avatar: true, src: br.brandlogo },
    }));
  }
  render() {
    const { brands, onSelect } = this.props;
    return (
      <Dropdown
        className="m-2"
        placeholder="Select Brand"
        fluid
        selection
        options={this.getBrandsOptions(brands)}
        onChange={onSelect}
      />
    );
  }
}
export default BrandsDropDown;
