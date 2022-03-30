import React, { Component } from "react";
import CategoriesTree from "./categoriesTree";
import PartsTree from "./partsTree";
import MyModalForm from "./common/myModalForm";
import PartSuppliers from "./partSuppliers";

// import BrandsDropDown from "./brandsDropDown";
import PartVehicles from "./partVehicles";
import LinkPartVehiclesForm from "./linkPartVehiclesForm";
import AlertDialog from "./common/alertDialog";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
  getAllParts,
  saveBrandPartVehicle,
  deleteBrandPartVehicle,
  saveCategory,
  deleteCategory,
  savePartName,
  saveBrandPart,
  deleteBrandPart,
  deletePartName,
  getSuppliers,
  saveBrandPartSupplier,
  deleteBrandPartSupplier,
  setNumOfParts,
} from "../services/phpdbservice";
import {
  getAllCategories,
  getBaseCategories,
  getCategoryParts,
  getBrandPartVehicles,
  getBrandPartSuppliers,
} from "../utils/categories";

import _ from "lodash";
import { getVehicleManufacturers } from "../utils/vehicles";
class LinkParts extends Component {
  state = {
    categories: [],
    allParts: [],
    brands: [],
    suppliers: [],
    // parts: [],
    category: null,
    brandPart: null,
    mainBrand: { brandid: "0", brandnameen: " All Brands" },
    modalShow: false,
    myModalShow: false,
    openAlertDialog: false,
    modalData: {
      title: "",
      fields: [],
    },
  };
  categoryFields = [
    {
      type: "input",
      controlId: "nameen",
      label: "Category Name (EN)",
      placeholder: "Enter Category English Name",
      required: true,
    },
    {
      type: "input",
      controlId: "namear",
      label: "Category Name (AR)",
      placeholder: "Enter Category Arabic Name",
      required: true,
    },
    {
      type: "input",
      controlId: "image",
      label: "Category Image)",
      placeholder: "Enter Category Image Link",
      required: false,
    },
  ];

  partNameFields = [
    {
      type: "input",
      controlId: "partnameen",
      label: "Part Name (EN)",
      placeholder: "Enter Part Name English",
      required: true,
    },
    {
      type: "input",
      controlId: "partnamear",
      label: "Category Name (AR)",
      placeholder: "Enter Part Name Arabic",
      required: false,
    },
    {
      type: "input",
      controlId: "image",
      label: "Part Name Image)",
      placeholder: "Enter Part Name Image Link",
      required: false,
    },
  ];

  categoryFields = [
    {
      type: "input",
      controlId: "nameen",
      label: "Category Name (EN)",
      placeholder: "Enter Category English Name",
      required: true,
    },
    {
      type: "input",
      controlId: "namear",
      label: "Category Name (AR)",
      placeholder: "Enter Category Arabic Name",
      required: true,
    },
    {
      type: "input",
      controlId: "image",
      label: "Category Image)",
      placeholder: "Enter Category Image Link",
      required: false,
    },
  ];

  brandPartFields = [
    {
      type: "select",
      controlId: "brandid",
      label: "Brand",
      items: this.state.brands,
      placeholder: "Enter Brand",
      required: true,
    },
    {
      type: "input",
      controlId: "manufacturerpartno",
      label: "Manufacturer Part No",
      placeholder: "Enter Manufacturer Part No",
      required: true,
    },
    {
      type: "input",
      controlId: "nameen",
      label: "Part Name",
      placeholder: "Enter Part Name ",
      required: false,
    },
    {
      type: "input",
      controlId: "image",
      label: "Part Image)",
      placeholder: "Enter Part Image Link",
      required: false,
    },
  ];

  partSupplierFields = [
    {
      type: "select",
      controlId: "supplierid",
      label: "Supplier",
      items: this.state.suppliers,
      placeholder: "Enter Supplier",
      required: true,
    },
    {
      type: "select",
      controlId: "status",
      label: "Status",
      items: [
        { val: "used", text: "used" },
        { val: "new", text: "new" },
      ],
      placeholder: "Enter Part Status",
      required: true,
    },
  ];

  async componentDidMount() {
    const allParts = await getAllParts();
    const allCategories = await getAllCategories();
    const categories = getBaseCategories(allCategories);
    const vehicles = await getVehicleManufacturers();
    let brands = _.uniqBy(allParts, "brandid");
    let allSuppliers = await getSuppliers();
    let suppliers = [];
    allSuppliers.map((s) =>
      suppliers.push({ val: s.id, text: s.publishnameen })
    );

    brands.push({ brandid: "0", brandnameen: " All Brands" });
    brands = _.orderBy(brands, ["brandnameen"], ["asc"]);
    this.setState({
      allCategories,
      categories,
      allParts,
      brands,
      vehicles,
      suppliers,
    });
  }
  handleCategorySelect = (category) => {
    category.parts = getCategoryParts(
      category,
      this.state.mainBrand,
      this.state.allParts
    );
    this.setState({ category, brandPart: null });
  };
  handleMyModalSave = async (data) => {
    this.setState({ myModalShow: false });
    let {
      modalCallBy,
      allParts,
      allCategories,
      parentCategory,
      category,
      partName,
      brandPart,
    } = this.state;
    if (modalCallBy === "category") {
      if (!category) category = {};
      Object.keys(data).map((key) => (category[key] = data[key]));
      if (!category.parentid)
        category.parentid = parentCategory ? parentCategory.id : "0";
      await saveCategory(
        _.omit(category, "subCategories", "parts"),
        allCategories
      );
      allCategories = await getAllCategories();
      this.setState({
        allCategories,
        categories: getBaseCategories(allCategories),
        category,
      });
      return;
    }
    if (modalCallBy === "partName") {
      let newPartName = {};
      Object.keys(data).map((key) => (newPartName[key] = data[key]));
      if (!newPartName.categoryid) newPartName.categoryid = category.id;
      newPartName = _.omit(newPartName, "brands");
      await savePartName(newPartName, category.parts);
      allParts = await getAllParts();
      category.parts = getCategoryParts(
        category,
        this.state.mainBrand,
        allParts
      );
      this.setState({ category, allParts });
      return;
    }
    if (modalCallBy === "brandPart") {
      let newBrandPart = {};
      Object.keys(data).map((key) => (newBrandPart[key] = data[key]));
      if (!newBrandPart.partnameid) newBrandPart.partnameid = partName.id;
      const brand = partName.brands.find(
        (br) => br.id === newBrandPart.brandid
      );
      const bpList = brand ? brand.brandParts : [];
      await saveBrandPart(
        _.omit(newBrandPart, "vehicles", "suppliers"),
        bpList
      );
      allParts = await getAllParts();
      category.parts = getCategoryParts(
        category,
        this.state.mainBrand,
        allParts
      );

      return;
    }
    if (modalCallBy === "partSupplier") {
      let newBPSupplier = {};
      Object.keys(data).map((key) => (newBPSupplier[key] = data[key]));
      if (!newBPSupplier.partbrandid) newBPSupplier.partbrandid = brandPart.id;
      let bpsInDB = brandPart.suppliers.find(
        (s) =>
          s.id === newBPSupplier.supplierid && s.status === newBPSupplier.status
      );
      if (!bpsInDB) await saveBrandPartSupplier(newBPSupplier);
      allParts = await getAllParts();
      category.parts = getCategoryParts(
        category,
        this.state.mainBrand,
        allParts
      );

      brandPart.suppliers = getBrandPartSuppliers(brandPart, allParts);
      this.setState({ category, allParts, brandPart });
      return;
    }
  };
  handleNewCategory = (category) => {
    const formTitle =
      category === null
        ? "New  Category"
        : `New  Subcategory of ${category.nameen}`;
    const modalData = {
      title: formTitle,
      fields: this.categoryFields,
      data: { nameen: "", namear: "" },
    };
    this.setState({
      modalData,
      myModalShow: true,
      modalCallBy: "category",
      parentCategory: category,
    });
  };
  handleNewPartName = (category) => {
    const modalData = {
      title: `New Part of ${category.nameen}`,
      fields: this.partNameFields,
      data: { partnameen: "", partnamear: "", image: "" },
    };
    this.setState({
      modalData,
      myModalShow: true,
      modalCallBy: "partName",
      category,
    });
  };
  handleNewBrandPart = (partName) => {
    const bpfields = this.brandPartFields;
    const brandField = bpfields.find((bpf) => bpf.controlId === "brandid");
    const { allParts } = this.state;
    let brands = _.uniqBy(allParts, "brandid");

    const brandItems = [];
    brands.map(
      (br) =>
        br.brandid &&
        br.brandnameen &&
        brandItems.push({ val: br.brandid, text: br.brandnameen })
    );
    brandField.items = brandItems;
    const modalData = {
      title: `New Brand of ${partName.partnameen}`,
      fields: bpfields,
      data: {
        brandid: brandItems[0].val,
        manufacturerpartno: "",
        nameen: "",
        image: "",
      },
    };
    this.setState({
      modalData,
      myModalShow: true,
      modalCallBy: "brandPart",
      partName,
    });
  };
  handleEditCategory = (category) => {
    const modalData = {
      title: `Edit Category ${category.nameen}`,
      fields: this.categoryFields,
      data: category,
    };
    this.setState({
      modalData,
      myModalShow: true,
      modalCallBy: "category",
    });
  };
  handleEditPartName = (partName) => {
    const modalData = {
      title: `Edit Part  ${partName.partnameen}`,
      fields: this.partNameFields,
      data: partName,
    };
    this.setState({
      modalData,
      myModalShow: true,
      modalCallBy: "partName",
    });
  };
  handleEditBrandPart = (brandPart) => {
    const bpfields = this.brandPartFields;
    const brandField = bpfields.find((bpf) => bpf.controlId === "brandid");
    const { allParts } = this.state;
    let brands = _.uniqBy(allParts, "brandid");
    const brandItems = [];
    brands.map(
      (br) =>
        br.brandid &&
        br.brandnameen &&
        brandItems.push({ val: br.brandid, text: br.brandnameen })
    );
    brandField.items = brandItems;
    const modalData = {
      title: `Edit Brand Part`,
      fields: bpfields,
      data: brandPart,
    };
    this.setState({
      modalData,
      myModalShow: true,
      modalCallBy: "brandPart",
    });
  };
  handleDeleteCategory = (category) => {
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete ${category.nameen} permanently from database`,
      alertCallBy: { type: "category", data: category },
    });
  };
  handleDeletePartName = (partName) => {
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete ${partName.partnameen} permanently from database`,
      alertCallBy: { type: "partName", data: partName },
    });
  };
  handleDeleteBrandPart = (brandPart) => {
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete ${brandPart.nameen} permanently from database`,
      alertCallBy: { type: "brandPart", data: brandPart },
    });
  };

  handlePartNameSelect = (partName) => {
    this.setState({ partName, brandPart: null });
  };
  handleBrandSelect = (brand) => {
    this.setState({ brandPart: null });
  };
  handleBrandPartSelect = (brandPart) => {
    brandPart.vehicles = getBrandPartVehicles(brandPart, this.state.allParts);
    brandPart.suppliers = getBrandPartSuppliers(brandPart, this.state.allParts);
    console.log("brandPart", brandPart);
    this.setState({ brandPart });
  };
  // handleMainBrandSelect = (e, { value }) => {
  //   const brand = this.state.brands.find((br) => br.brandid === value);
  //   const parts = getCategoryParts(
  //     this.state.category,
  //     brand,
  //     this.state.allParts
  //   );
  //   this.setState({ parts, mainBrand: brand, brandPart: null });
  // };
  handleAddVehicle = (brandPart) => {
    this.setState({
      modalShow: true,
      showType: "new",
    });
  };
  handleDeleteVehicle = (vehicle) => {
    console.log("vehicle", vehicle);
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete  ${vehicle.manufacturernameen} ${vehicle.modelnameen} ${vehicle.year1}-${vehicle.year2} permanently from database`,
      alertCallBy: { type: "brandPartVehicle", data: vehicle },
    });
  };
  handleDialogConfirm = async (m) => {
    this.setState({ openAlertDialog: false });
    if (m === "0") return;
    let { alertCallBy, allParts, category } = this.state;
    if (alertCallBy.type === "brandPartVehicle") {
      const { brandPart } = this.state;
      let newBrandPart = brandPart.vehicles.filter(
        (v) => m.id !== alertCallBy.data.id
      );
      this.setState({ brandPart: newBrandPart });
      await deleteBrandPartVehicle(alertCallBy.data);
      const allParts = await getAllParts();
      this.setState({ brandPart: newBrandPart, allParts });
      return;
    }
    if (alertCallBy.type === "category") {
      await deleteCategory(alertCallBy.data);
      const allCategories = await getAllCategories();
      this.setState({
        allCategories,
        categories: getBaseCategories(allCategories),
      });
    }
    if (alertCallBy.type === "partName") {
      await deletePartName(alertCallBy.data);
      allParts = await getAllParts();
      category.parts = getCategoryParts(
        category,
        this.state.mainBrand,
        allParts
      );
      this.setState({ category, allParts });
    }

    if (alertCallBy.type === "brandPart") {
      await deleteBrandPart(alertCallBy.data);
      allParts = await getAllParts();
      category.parts = getCategoryParts(
        category,
        this.state.mainBrand,
        allParts
      );
      this.setState({ category, allParts });
    }
    if (alertCallBy.type === "brandPartSupplier") {
      await deleteBrandPartSupplier(alertCallBy.data);
      allParts = await getAllParts();
      category.parts = getCategoryParts(
        category,
        this.state.mainBrand,
        allParts
      );
      const { brandPart } = this.state;
      brandPart.suppliers = await getBrandPartSuppliers(
        brandPart,
        this.state.allParts
      );
      this.setState({ category, allParts, brandPart });
    }
  };
  handleEditVehicle = (vehicle) => {
    this.setState({
      modalShow: true,
      showType: "edit",
      vehicle,
    });
  };
  setModalShow(modalShow) {
    this.setState({ modalShow });
  }
  setMyModalShow(myModalShow) {
    this.setState({ myModalShow });
  }
  handleModalSave = async (brandPartVehicle) => {
    const { brandPart } = this.state;
    await saveBrandPartVehicle(
      _.omit(brandPartVehicle, "manufacturernameen", "modelnameen")
    );
    if (!brandPartVehicle.id) {
      brandPartVehicle.id = "0";
      brandPart.vehicles.push(brandPartVehicle);
    }
    this.setState({ modalShow: false, brandPart });
    const allParts = await getAllParts();
    this.setState({ allParts });
  };
  handleSupplierDelete = (part) => {
    this.setState({
      openAlertDialog: true,
      dialogMessage: `Delete part supplier permanently from database`,
      alertCallBy: { type: "brandPartSupplier", data: part },
    });
    console.log("part", part);
  };
  handleSupplierAdd = (brandPart) => {
    this.partSupplierFields[0].items = this.state.suppliers;

    const modalData = {
      title: `New Supplier `,
      fields: this.partSupplierFields,
      data: { supplierid: "1", status: "used" },
    };
    this.setState({
      modalData,
      myModalShow: true,
      modalCallBy: "partSupplier",
      brandPart,
    });

    ///
    console.log("brandPart", brandPart);
    //
  };

  handleSupplierPartInc = (supplierPart) => {
    const { brandPart } = this.state;
    let num = parseInt(supplierPart.numberofparts);
    num += 1;
    const sup = brandPart.suppliers.find(
      (s) =>
        s.supplierid === supplierPart.supplierid &&
        s.status === supplierPart.status
    );
    if (!sup) return;
    brandPart.suppliers[brandPart.suppliers.indexOf(sup)].numberofparts = num;
    setNumOfParts(sup, num);
    this.setState({ brandPart });
  };
  handleSupplierPartDec = (supplierPart) => {
    const { brandPart } = this.state;
    let num = parseInt(supplierPart.numberofparts);
    if (num <= 0) return;
    num -= 1;
    const sup = brandPart.suppliers.find(
      (s) =>
        s.supplierid === supplierPart.supplierid &&
        s.status === supplierPart.status
    );
    if (!sup) return;
    brandPart.suppliers[brandPart.suppliers.indexOf(sup)].numberofparts = num;
    setNumOfParts(sup, num);
    this.setState({ brandPart });
  };

  render() {
    const {
      categories,
      allParts,
      myModalShow,
      partName,
      // brands,
      category,
      brandPart,
      modalShow,
      openAlertDialog,
      dialogMessage,
      vehicles,
      showType,
      vehicle,
    } = this.state;
    const { user, allowEdit } = this.props;
    return (
      <div className="row">
        <div className="col-3">
          <CategoriesTree
            categories={categories}
            selectedCategory={category}
            allParts={allParts}
            onSelect={this.handleCategorySelect}
            onNewCategory={this.handleNewCategory}
            onEditCategory={this.handleEditCategory}
            onDeleteCategory={this.handleDeleteCategory}
            user={user}
            allowEdit={allowEdit}
          />
        </div>
        <div className="col-4">
          {/* <BrandsDropDown
            brands={brands}
            onSelect={this.handleMainBrandSelect}
          /> */}
          <PartsTree
            allParts={allParts}
            category={category}
            selectedPartName={partName}
            selectedBrandPart={brandPart}
            onBrandPartSelect={this.handleBrandPartSelect}
            onPartNameSelect={this.handlePartNameSelect}
            onBrandSelect={this.handleBrandSelect}
            user={user}
            allowEdit={allowEdit}
            onNewPartName={this.handleNewPartName}
            onEditPartName={this.handleEditPartName}
            onDeletePartName={this.handleDeletePartName}
            onNewBrandPart={this.handleNewBrandPart}
            onEditBrandPart={this.handleEditBrandPart}
            onDeleteBrandPart={this.handleDeleteBrandPart}
          />
        </div>
        <div className="col">
          <Tabs defaultActiveKey="vehicles" id="uncontrolled-tab-example">
            <Tab eventKey="vehicles" title="Vehicles">
              <PartVehicles
                brandPart={brandPart}
                allowEdit={allowEdit}
                onAddVehicle={this.handleAddVehicle}
                onDeleteVehicle={this.handleDeleteVehicle}
                onEditVehicle={this.handleEditVehicle}
              />
            </Tab>
            <Tab eventKey="suppliers" title="Suppliers">
              <PartSuppliers
                brandPart={brandPart}
                allowEdit={allowEdit}
                onSupplierDelete={this.handleSupplierDelete}
                onSupplierAdd={this.handleSupplierAdd}
                onInc={this.handleSupplierPartInc}
                onDec={this.handleSupplierPartDec}
              />
            </Tab>
          </Tabs>
        </div>
        <MyModalForm
          show={myModalShow}
          onHide={() => this.setMyModalShow(false)}
          onSave={this.handleMyModalSave}
          modaldata={this.state.modalData}
        />
        <LinkPartVehiclesForm
          show={modalShow}
          onHide={() => this.setModalShow(false)}
          onSave={this.handleModalSave}
          vehicles={vehicles}
          brandPart={brandPart}
          showType={showType}
          vehicle={vehicle}
        />
        <AlertDialog
          open={openAlertDialog}
          onClose={this.handleDialogConfirm}
          message={dialogMessage}
        />
      </div>
    );
  }
}
export default LinkParts;
