import $ from "jquery";
import _ from "lodash";
const serviceURL = "http://www.tochangehybrid.com/php/sqlservice.php";

// ------------------------------SAVE DATA ---------------------------------
async function saveItem(item, items, tableName) {
  let itemInDB = false;
  if (items) itemInDB = items.find((m) => (m && m.id) === item.id) || {};

  if (!itemInDB.id) {
    const newObj = {
      REQACTION: "ADDDATA",
      TABLENAME: tableName,
      ...item,
    };
    await $.post(serviceURL, newObj).then(function (data, status) {
      alert(status + "/n" + data);
    });
    return;
  }
  let SQL = `UPDATE ${tableName} SET `;
  const numOfKeys = Object.keys(item).length;
  for (let i = 0; i < numOfKeys; i++) {
    if (Object.keys(item)[i] !== "id") {
      SQL += ` ${Object.keys(item)[i]} = '${item[Object.keys(item)[i]]}' `;
      if (i < numOfKeys - 1) SQL += " , ";
    }
  }
  SQL += ` WHERE ${tableName}.id = '${item.id}' `;

  await $.post(serviceURL, { REQACTION: "UPDATESQL", SQL: `${SQL}` }, function (
    data,
    status
  ) {
    alert(data);
  });
}
// ======================== getVehicles ========================================
export async function getVehicles() {
  const sql = `SELECT CarManufacturers.id AS manufacturerid,
                      CarManufacturers.nameen AS manufacturernameen,
                      CarManufacturers.namear AS manufacturernamear,
                      CarManufacturers.logo AS manufacturerlogo,
                      CarModels.id AS modelid,
                      CarModels.nameen AS modelnameen,
                      CarModels.namear AS modelnamear,
                      CarModels.image AS modelimage,
                      CarYears.id AS yearid,
                      CarYears.year AS modelyear,
                      CarYears.fueltype AS fueltype,
                      CarYears.enginespecs AS enginespecs,
                      CarYears.image AS modelyearimage
                FROM CarManufacturers 
                LEFT JOIN CarModels  ON CarModels.manufacturerid = CarManufacturers.id
                LEFT JOIN CarYears  ON CarYears.modelid = CarModels.id
                `;

  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}
// ------------------------------saveVehicleManufacturer -----------------------
export async function saveVehicleManufacturer(manufacturers, manufacturer) {
  const res = await saveItem(manufacturer, manufacturers, "CarManufacturers");
  return res;
}
// ------------------------------deleteVehicleManufacturer -----------------------
export async function deleteVehicleManufacturer(manufacturer) {
  const sql = `DELETE FROM CarManufacturers WHERE id = '${manufacturer.id}'`;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}

// ------------------------------SAVE vehicleModel -----------------------
export async function saveVehicleModel(models, model) {
  const res = await saveItem(model, models, "CarModels");
  return res;
}
// ------------------------------Delete vehicleModel -----------------------
export async function deleteVehicleModel(model) {
  const sql = `DELETE FROM CarModels WHERE id = '${model.id}'`;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}
// ------------------------------SAVE vehicleYear -----------------------
export async function saveVehicleYear(years, year) {
  const res = await saveItem(year, years, "CarYears");
  return res;
}
// ------------------------------Delete vehicleYear -----------------------
export async function deleteVehicleYear(year) {
  const sql = `DELETE FROM CarYears WHERE id = '${year.id}'`;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}
// ================================getCategories=======================================
export async function getCategories() {
  const sql = `SELECT * FROM PartCategories`;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}
// =============================getAllPartNames==========================================
export async function getAllParts() {
  let sql = `SELECT PartNames.id AS partnameid,
                    PartNames.categoryid,
                    PartNames.partnameen,
                    PartNames.partnamear,
                    PartNames.image AS partnameimage,
                    BrandParts.id AS brandpartid,
                    BrandParts.brandid,
                    BrandParts.manufacturerpartno,
                    BrandParts.nameen AS brandpartnameen,
                    BrandParts.image AS brandpartimage,
                    SupplierParts.supplierid,
                    SupplierParts.status,
                    SupplierParts.numberofparts,
                    Suppliers.publishnameen AS suppliernameen,
                    Brands.nameen AS brandnameen,
                    Brands.logo AS brandlogo,
                    BrandPartVehicles.id AS brandpartvehicleid,
                    BrandPartVehicles.vehiclemanufacturerid AS brandvehiclemanufacturerid,
                    BrandPartVehicles.vehiclemodelid AS brandvehiclemodelid,
                    BrandPartVehicles.year1 AS year1,
                    BrandPartVehicles.year2 AS year2,
                    CarManufacturers.nameen AS carmanufacturer,
                    CarModels.nameen AS modelnameen
             FROM PartNames 
             LEFT JOIN BrandParts ON PartNames.id = BrandParts.partnameid
             LEFT JOIN SupplierParts ON SupplierParts.partbrandid = BrandParts.id
             LEFT JOIN Brands ON BrandParts.brandid = Brands.id
             LEFT JOIN BrandPartVehicles ON BrandPartVehicles.brandpartid = BrandParts.id 
             LEFT JOIN CarManufacturers ON CarManufacturers.id = BrandPartVehicles.vehiclemanufacturerid
             LEFT JOIN CarModels ON CarModels.id = BrandPartVehicles.vehiclemodelid
             LEFT JOIN Suppliers ON Suppliers.id = SupplierParts.supplierid
             `;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}
// ===================================getBrandParts====================================
export async function getBrandParts() {
  const sql = `SELECT BrandParts.*,Brands.nameen AS brandnameen,Brands.logo AS brandlogo
                FROM BrandParts 
                JOIN Brands ON  Brands.id = BrandParts.brandid `;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}
// =============================getAllSuppliersParts==========================================
export async function getAllSuppliersParts(user) {
  let sql = `SELECT *,Suppliers.publishnameen AS suppliernameen 
               FROM SupplierParts
               JOIN Suppliers ON Suppliers.id = SupplierParts.supplierid`;
  if (user && user.authorization === "supplier")
    sql += ` WHERE SupplierParts.supplierid = '${user.id}'`;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });

  return myData;
}
// =============================setNumOfParts==========================================
export function setNumOfParts(supplierPart, num) {
  //UPDATE `SupplierParts` SET `numberofparts` = '6' WHERE `SupplierParts`.`supplierid` = 1 AND `SupplierParts`.`partbrandid` = 1 AND `SupplierParts`.`status` = 'used';
  let SQL = `UPDATE SupplierParts SET numberofparts ='${num}' WHERE supplierid = '${supplierPart.supplierid}' AND partbrandid = '${supplierPart.partbrandid}' AND status = '${supplierPart.status}'`;

  $.post(serviceURL, { REQACTION: "UPDATESQL", SQL: `${SQL}` }, function (
    data,
    status
  ) {
    // alert(data);
  });
}
// =======================================================================

export async function deleteBrandPartVehicle(vehicle) {
  const sql = `DELETE FROM BrandPartVehicles WHERE id = '${vehicle.id}'`;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}
// =============================deleteBrandPartSupplier==========================================

export async function deleteBrandPartSupplier(brandPartSupplier) {
  const sql = `DELETE FROM SupplierParts WHERE 
               supplierid = '${brandPartSupplier.supplierid}' 
               AND partbrandid = '${brandPartSupplier.partbrandid}' 
               AND partbrandid = '${brandPartSupplier.partbrandid}' 
               AND status = '${brandPartSupplier.status}' 
               `;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}
// =======================================================================
export async function saveBrandPartVehicle(brandPartVehicle) {
  if (!brandPartVehicle.id) {
    const newObj = {
      REQACTION: "ADDDATA",
      TABLENAME: "BrandPartVehicles",
      ...brandPartVehicle,
    };
    await $.post(serviceURL, newObj).then(function (data, status) {
      alert(status + "/n" + data);
    });
    return;
  }
  let item = brandPartVehicle;
  let tableName = "BrandPartVehicles";

  let SQL = `UPDATE ${tableName} SET `;
  const numOfKeys = Object.keys(item).length;
  for (let i = 0; i < numOfKeys; i++) {
    if (Object.keys(item)[i] !== "id") {
      SQL += ` ${Object.keys(item)[i]} = '${item[Object.keys(item)[i]]}' `;
      if (i < numOfKeys - 1) SQL += " , ";
    }
  }
  SQL += ` WHERE ${tableName}.id = '${item.id}' `;

  await $.post(serviceURL, { REQACTION: "UPDATESQL", SQL: `${SQL}` }, function (
    data,
    status
  ) {
    alert(data);
  });
}
// =================================saveCategory======================================
export async function saveCategory(category, categories) {
  const res = await saveItem(category, categories, "PartCategories");
  return res;
}
// =================================saveCategory======================================
export async function savePartName(partName, partNames) {
  const res = await saveItem(partName, partNames, "PartNames");
  return res;
}
// ===============================deleteCategory========================================
export async function deleteCategory(category) {
  const sql = `DELETE FROM PartCategories WHERE id = '${category.id}'`;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}
// =================================deleteBrandPart======================================
export async function deleteBrandPart(brandPart) {
  const sql = `DELETE FROM BrandParts 
                WHERE id = '${brandPart.id}' 
                `;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}
// =================================deletePartName======================================
export async function deletePartName(partname) {
  const sql = `DELETE FROM PartNames WHERE id = '${partname.id}'`;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}
// =================================saveBrandPart======================================
export async function saveBrandPart(brandPart, brandParts) {
  const res = await saveItem(brandPart, brandParts, "BrandParts");
  return res;
}
// =================================saveBrandPartSupplier======================================
export async function saveBrandPartSupplier(brandPartSupplier) {
  let item = brandPartSupplier;
  let tableName = "SupplierParts";
  // if (!item.id) {
  const newObj = {
    REQACTION: "ADDDATA",
    TABLENAME: tableName,
    ...item,
  };
  await $.post(serviceURL, newObj).then(function (data, status) {
    alert(status + "/n" + data);
  });
  //   return;
  // }

  // let SQL = `UPDATE ${tableName} SET `;
  // const numOfKeys = Object.keys(item).length;
  // for (let i = 0; i < numOfKeys; i++) {
  //   if (Object.keys(item)[i] !== "id") {
  //     SQL += ` ${Object.keys(item)[i]} = '${item[Object.keys(item)[i]]}' `;
  //     if (i < numOfKeys - 1) SQL += " , ";
  //   }
  // }
  // SQL += ` WHERE ${tableName}.id = '${item.id}' `;

  // await $.post(serviceURL, { REQACTION: "UPDATESQL", SQL: `${SQL}` }, function (
  //   data,
  //   status
  // ) {
  //   alert(data);
  // });
}
// ==================================getSuppliers=====================================
export async function getSuppliers() {
  const sql = `SELECT * FROM Suppliers`;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}
// =======================================================================

export async function getBrands() {
  const sql = `SELECT Brands.*, 
              (SELECT COUNT(*) FROM BrandParts WHERE BrandParts.brandid = Brands.id) AS totalparts 
              FROM Brands
              ORDER BY nameen`;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
    console.log("brands", myData);
  });
  return myData;
}
export async function getBrand(id) {
  const brands = await getBrands();
  return brands.find((m) => m.id === id);
}

export async function saveBrand(brand) {
  const brands = await getBrands();
  const item = _.omit(brand, "totalparts");
  console.log(item);
  const res = await saveItem(item, brands, "Brands");
  return res;
}

export async function getAllCategories() {
  const sql = `SELECT PartCategories.*, 
                (SELECT COUNT(*) FROM PartNames WHERE PartNames.categoryid = PartCategories.id) AS totalpartnames
              FROM PartCategories`;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}

export async function getChildCategories(parentId) {
  const sql = `SELECT PartCategories.*, (SELECT COUNT(*) FROM PartNames WHERE PartNames.categoryid = PartCategories.id) AS totalpartnames
              FROM PartCategories WHERE PartCategories.parentid = '${parentId}'`;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}
export async function getCategory(id) {
  const categories = await getAllCategories();
  return categories.find((m) => m.id === id);
}

export async function getCategoryParts(category) {
  const parts = await getPartNames();
  // console.log("parts", parts);
  const categoryparts = parts.filter((p) => p.categoryid === category.id);
  return categoryparts;
}
export async function getPartNames() {
  const sql = `SELECT PartNames.*, (SELECT COUNT(*) FROM BrandParts WHERE BrandParts.partnameid = PartNames.id) AS totalitems
              FROM PartNames ORDER BY partnameen`;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}
export async function getPartName(id) {
  const parts = await getPartNames();
  return parts.find((m) => m.id === id);
}
export async function savePart(part) {
  const partnames = await getPartNames();
  const item = _.omit(part, ["totalitems"]);
  const res = await saveItem(item, partnames, "PartNames");
  return res;
}

export async function getAllBrandParts() {
  const sql = `SELECT BrandParts.*,
                      PartNames.partnameen,
                      PartNames.categoryid,
                      Brands.nameen AS brandnameen ,
                      (SELECT COUNT(*) FROM SupplierParts WHERE SupplierParts.partbrandid = BrandParts.id) AS totalsuppliers
                      FROM BrandParts
                      JOIN PartNames ON PartNames.id = BrandParts.partnameid
                      JOIN Brands ON Brands.id = BrandParts.brandid`;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}
// export async function getAllBrandParts() {
//   const sql = `SELECT * FROM BrandParts`;
//   let myData = [];
//   await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
//     response
//   ) {
//     myData = JSON.parse(response);
//   });
//   return myData;
// }

export async function deleteBrand(brand) {
  const sql = `DELETE FROM Brands WHERE id = '${brand.id}'`;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}
export async function deleteSupplierPart(part) {
  const sql = `DELETE FROM SupplierParts 
                WHERE supplierid = '${part.supplierid}' 
                AND  partbrandid='${part.partbrandid}' 
                AND  status='${part.status}'`;
  await $.post(serviceURL, { REQACTION: "DELETESQL", SQL: sql }).then(function (
    data,
    status
  ) {
    alert(data);
  });
}

export async function getSupplier(supplierId) {
  const suppliers = await getSuppliers();
  return suppliers.find((m) => m.id === supplierId);
}

export async function getSupplierParts(supplier) {
  const sql = `
  SELECT SupplierParts.*,BrandParts.brandid as brandid,Brands.nameen as brandname,Brands.logo as brandlogo,
  PartNames.partnameen as brandpartnameen  
  FROM SupplierParts 
  JOIN BrandParts ON BrandParts.id = SupplierParts.partbrandid
  JOIN Brands ON Brands.id = BrandParts.brandid
  JOIN PartNames ON PartNames.id = BrandParts.partnameid
  
  WHERE SupplierParts.supplierid = '${supplier.id}'`;

  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });

  return myData;
}
// export async function getEnhancedBrandParts() {
//   const sql = `SELECT BrandParts.*,PartNames.partnameen,
//                     PartNames.categoryid,
//                     Brands.nameen AS brandnameen,
//                     Suppliers.publishnameen AS suppliername,
//                     SupplierParts.status AS partstatus,
//                     SupplierParts.numberofparts AS partcount
//                 FROM BrandParts
//                     JOIN PartNames ON PartNames.id = BrandParts.partnameid
//                     JOIN Brands ON Brands.id = BrandParts.brandid
//                     LEFT JOIN SupplierParts ON SupplierParts.partbrandid = BrandParts.id
//                     LEFT JOIN Suppliers ON Suppliers.id = SupplierParts.supplieridw
//                 `;
//   let myData = [];
//   await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
//     response
//   ) {
//     myData = JSON.parse(response);
//   });
//   return myData;
// }

export async function getAllSuppliers() {
  const sql = `SELECT * FROM Suppliers`;
  let myData = [];
  await $.post(serviceURL, { REQACTION: "GETSQLARR", SQL: sql }).then(function (
    response
  ) {
    myData = JSON.parse(response);
  });
  return myData;
}

export async function saveSupplierPart(supplierPart) {
  const item = supplierPart;
  const res = await saveItem(item, [], "SupplierParts");
  return res;
}

export async function showDevData(devId) {
  let myData = [];
  await $.post(serviceURL, { REQACTION: "DEVDATA", DEVID: devId }).then(
    function (response) {
      myData = JSON.parse(response);
      // return response;
    }
  );
  return myData;
}
