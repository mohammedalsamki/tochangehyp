import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Navigation from "./components/navigation";
import Brands from "./components/brands";
import LoginForm from "./components/loginForm";
// import BrandForm from "./components/brandForm";
// import RegisterForm from "./components/registerForm";
// import Categories from "./components/categories";
import NotFound from "./components/notFound";
import Vehicles from "./components/vehicles";
import TCBatteryTesters from "./components/tcBatteryTesters";
// import VehicleForm from "./components/vehicleForm";
// import CategoryForm from "./components/categoryForm";
// import PartForm from "./components/partForm";
// import Parts from "./components/parts";
// import BrandParts from "./components/brandParts";
// import BrandPartForm from "./components/brandPartForm";
// import Suppliers from "./components/suppliers";
// import SupplierParts from "./components/supplierParts";
// import AddPartToSupplierForm from "./components/addPartToSupplierForm";
import Logout from "./components/logout";
import { getCurrentUser } from "./services/userService";
import "./App.css";
// import PartNames from "./components/partNames";
import LinkParts from "./components/linkParts";

class App extends Component {
  state = {
    user: { authorization: "", username: "", id: "" },
    allowEdit: false,
  };
  componentDidMount() {
    const user = getCurrentUser();
    this.setState({ user });
  }
  handleAllowEdit = () => {
    const { allowEdit } = this.state;
    this.setState({ allowEdit: !allowEdit });
  };
  render() {
    const logoURL = "http://www.tochangehybrid.com/images/utilities/home.jpg";
    return (
      <React.Fragment>
        <Navigation
          logo={logoURL}
          user={this.state.user}
          onAllowEdit={this.handleAllowEdit}
        />

        <Switch>
          {/* <Route path="/register" component={RegisterForm} /> */}
          <Route path="/login" component={LoginForm} />
          <Route path="/logout" component={Logout} />
          <Route path="/vehicles" component={Vehicles} />
          <Route
            path="/linkparts"
            render={(props) => (
              <LinkParts
                {...props}
                user={this.state.user}
                allowEdit={this.state.allowEdit}
              />
            )}
          />
          <Route
            path="/tcbt/:devid?"
            render={(props) => (
              <TCBatteryTesters {...props} user={this.state.user} />
            )}
          />

          {/* <Route
            path="/partnames"
            component={PartNames}
            // render={(props) => <PartNames {...props} user={this.state.user} />}
          />
          <Route
            path="/vehicleform/:manufacturerid?/:modelid?/:yearid?"
            component={VehicleForm}
          />
          <Route path="/brandform/:brandid?" component={BrandForm} /> */}
          <Route path="/brands/:brandid?" component={Brands} />
          {/* <Route path="/TCBT/ component={Parts} /> */}
          {/* <Route path="/partform/:categoryid?/:partid?/" component={PartForm} /> */}
          {/* <Route path="/categories/:parentid?" component={Categories} /> */}
          {/* <Route
            path="/categoryform/:parentid?/:categoryid?"
            component={CategoryForm}
          /> */}
          {/* <Route
            path="/brandpartform/:brandid?/:partnameid?/:partid?/:currentpage?/"
            component={BrandPartForm}
          /> */}
          {/* <Route
            path="/brandparts/:brandid?/:partnameid?/:currentpage?"
            component={BrandParts}
          /> */}
          {/* <Route path="/supplierparts/:supplierid/" component={SupplierParts} /> */}
          {/* <Route path="/suppliers/" component={Suppliers} /> */}
          <Route path="/not-found" component={NotFound} />
          {/* <Route
            path="/addparttosupplier/:brandpartid?/:brandid?/:partnameid?/:currentpage?"
            component={AddPartToSupplierForm}
          /> */}
          <Redirect from="/" exact to="linkparts" />
          <Redirect to="not-found" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
