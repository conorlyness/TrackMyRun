let coreQueries = {
  viewAllRuns: `SELECT * FROM public.runlog ORDER BY "rundate" DESC;`,
  viewAllRunsInRange: `select "rundate", "distance", "notes", "rpe", "tags" from "runlog" where "rundate" >= '{start}' and "rundate" <= '{end}';`,
  logRun: `Insert into public.runlog ("rundate", "distance", "notes", "rpe", "shoe", "tags") values ('{run.date}', '{run.distance}', '{run.notes}', '{run.rpe}', '{run.shoes}', '{run.tags}');`,
  editRun: `UPDATE public.runlog SET "distance" = '{run.distance}', "notes" = '{run.notes}', "rpe" = '{run.rpe}', "shoe" = '{run.shoe}', "tags" = '{run.tags}' WHERE "rundate" = '{run.date}' AND "id" = '{run.id}';`,
  deleteRun: `DELETE FROM public.runlog WHERE "rundate" = '{run.date}' AND "distance" = '{run.distance}' AND "notes" = '{run.notes}' AND "rpe" = '{run.rpe}' AND "shoe" = '{run.shoe}';`,
  viewAllPersonalBests: `SELECT * FROM public.personalbests ORDER BY "time" ASC;`,
  editPersonalBest: `UPDATE public.personalbests SET "time" = '{time}' WHERE "distance" = '{distance}'`,
  viewAllShoes: `SELECT * FROM public.shoes;`,
  addNewShoes: `Insert into public.shoes values ('{shoe.brand}', '{shoe.name}', 0, true);`,
  increaseShoeDistance: `UPDATE public.shoes SET "distance" = "distance" + '{shoe.distance}' WHERE "brand" = '{shoe.brand}' AND "name" = '{shoe.name}';`,
  decreaseShoeDistance: `UPDATE public.shoes SET "distance" = "distance" - '{shoe.distance}' WHERE "brand" = '{shoe.brand}' AND "name" = '{shoe.name}';`,
  reactivateShoe: `UPDATE public.shoes SET "active" = true WHERE "brand" = '{shoe.brand}' AND "name" = '{shoe.name}';`,
  retireShoe: `UPDATE public.shoes SET "active" = false WHERE "brand" = '{shoe.brand}' AND "name" = '{shoe.name}';`,
  deleteShoe: `DELETE FROM public.shoes WHERE "brand" = '{shoe.brand}' AND "name" = '{shoe.name}';`,
  addImage: `Insert into public.images ("url", "description", "tags") values ('{img.url}', '{img.description}', '{img.tags}');`,
  getAllImages: `SELECT * FROM public.images;`,
};

module.exports = coreQueries;
