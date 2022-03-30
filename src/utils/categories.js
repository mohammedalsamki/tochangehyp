import { getCategories } from "../services/phpdbservice";
import _ from "lodash";
//---------------------------------------------------------------------------------------
export async function getAllCategories() {
  const categories = await getCategories();
  return categories;
}
//---------------------------------------------------------------------------------------
export function getBaseCategories(categories) {
  const baseCategories = categories.filter((c) => c.parentid === "0");
  baseCategories.map(
    (c) => (c.subCategories = categories.filter((f) => f.parentid === c.id))
  );
  baseCategories.map(
    (c) =>
      c.subCategories &&
      c.subCategories.map(
        (sc) =>
          (sc.subCategories = categories.filter((f) => f.parentid === sc.id))
      )
  );
  baseCategories.map(
    (c) =>
      c.subCategories &&
      c.subCategories.map(
        (sc) =>
          sc.subCategories &&
          sc.subCategories.map(
            (ssc) =>
              (ssc.subCategories = categories.filter(
                (f) => f.parentid === ssc.id
              ))
          )
      )
  );
  return baseCategories;
}
//---------------------------------------------------------------------------------------
function getCategoryPartNames(category, allParts) {
  let parts = allParts.filter((p) => p.categoryid === category.id);
  parts = _.uniqBy(parts, "partnameid");
  let partNames = [];
  parts.map((p) =>
    partNames.push({
      id: p.partnameid,
      partnameen: p.partnameen,
      image: p.partnameimage,
      partnamear: p.partnamear,
    })
  );
  return partNames;
}
//---------------------------------------------------------------------------------------
function getPartNameBrands(partName, allParts) {
  let parts = allParts.filter((p) => p.partnameid === partName.id);
  parts = _.uniqBy(parts, "brandid");
  let brands = [];
  parts.map(
    (p) =>
      p.brandid &&
      brands.push({
        id: p.brandid,
        nameen: p.brandnameen,
        logo: p.brandlogo,
      })
  );
  return brands;
}
//---------------------------------------------------------------------------------------
function getBrandParts(partName, brand, allParts) {
  let parts = allParts.filter(
    (p) => p.partnameid === partName.id && p.brandid === brand.id
  );
  parts = _.uniqBy(parts, "brandpartid");
  let brandParts = [];
  parts.map((p) =>
    brandParts.push({
      id: p.brandpartid,
      nameen: p.brandpartnameen,
      image: p.brandpartimage,
      brandid: brand.id,
      manufacturerpartno: p.manufacturerpartno,
      vehicles: [],
    })
  );
  return brandParts;
}
//---------------------------------------------------------------------------------------
export function getCategoryParts(category, brand, allParts) {
  if (!category) return;
  let partNames = getCategoryPartNames(category, allParts);
  partNames.map((pN) => (pN.brands = getPartNameBrands(pN, allParts)));
  partNames.map((pN) =>
    pN.brands.map((pNB) => (pNB.brandParts = getBrandParts(pN, pNB, allParts)))
  );
  return partNames;
}
//---------------------------------------------------------------------------------------
export function getBrandPartVehicles(brandPart, allParts) {
  let vehicles = allParts.filter((p) => p.brandpartid === brandPart.id);
  vehicles = _.uniqBy(vehicles, "brandpartvehicleid");
  let brandVehicles = [];
  vehicles.map(
    (v) =>
      v.brandpartvehicleid &&
      brandVehicles.push({
        id: v.brandpartvehicleid,
        brandpartid: v.brandpartid,
        vehiclemanufacturerid: v.brandvehiclemanufacturerid,
        manufacturernameen: v.carmanufacturer,
        vehiclemodelid: v.brandvehiclemodelid,
        modelnameen: v.modelnameen,
        year1: v.year1,
        year2: v.year2,
      })
  );
  return brandVehicles;
}
//---------------------------------------------------------------------------------------
export function getBrandPartSuppliers(brandPart, allParts) {
  let suppliers = allParts.filter((p) => p.brandpartid === brandPart.id);
  // suppliers = _.uniqBy(suppliers, "status", "supplierid");
  console.log("suppliers", suppliers);

  let brandSuppliers = [];
  suppliers.map((s) =>
    brandSuppliers.push({
      partbrandid: brandPart.id,
      supplierid: s.supplierid,
      status: s.status,
      numberofparts: s.numberofparts,
      suppliernameen: s.suppliernameen,
    })
  );
  brandSuppliers = _.uniqWith(brandSuppliers, _.isEqualWith);

  return brandSuppliers;
}
