import { getVehicles } from "../services/phpdbservice";
import _ from "lodash";

function getModelYears(modelid, vehicles) {
  let years = vehicles.filter((v) => v.yearid && v.modelid === modelid);
  years = _.uniqBy(years, "yearid");
  years = _.orderBy(years, ["modelyear"], ["asc"]);
  let modelYears = years.map((y) => ({
    id: y.yearid,
    year: y.modelyear,
    fueltype: y.fueltype,
    image: y.modelyearimage,
    enginespecs: y.enginespecs,
  }));

  return modelYears;
}

function getManufacturerModels(manufacturerid, vehicles) {
  let models = vehicles.filter(
    (v) => v.modelid && v.manufacturerid === manufacturerid
  );
  models = _.uniqBy(models, "modelid");

  let manufacturerModels = models.map((m) => ({
    id: m.modelid,
    nameen: m.modelnameen,
    namear: m.modelnamear,
    image: m.modelimage,
    manufacturerid,
    years: getModelYears(m.modelid, vehicles),
  }));

  return manufacturerModels;
}

export async function getVehicleManufacturers() {
  const vehicles = await getVehicles();
  let vehicleManufacturers = vehicles.map((v) => ({
    id: v.manufacturerid,
    nameen: v.manufacturernameen,
    namear: v.manufacturernamear,
    logo: v.manufacturerlogo,
  }));
  vehicleManufacturers = _.uniqBy(vehicleManufacturers, "id");
  vehicleManufacturers = _.orderBy(vehicleManufacturers, ["nameen"], ["asc"]);
  vehicleManufacturers.map(
    (m) => (m.models = getManufacturerModels(m.id, vehicles))
  );
  return vehicleManufacturers;
}
