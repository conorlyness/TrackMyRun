let coreQueries = {
  viewAllRuns: `SELECT * FROM "RunLog" ORDER BY "RunDate" DESC;`,
  viewAllRunsInRange: `select "RunDate", "Distance", "Notes", "RPE" from "RunLog" where "RunDate" >= '{start}' and "RunDate" <= '{end}';`,
  logRun: `Insert into "RunLog" ("RunDate", "Distance", "Notes", "RPE", "Shoe") values ('{run.date}', '{run.distance}', '{run.notes}', '{run.rpe}', '{run.shoes}');`,
  editRun: `UPDATE "RunLog" SET "Distance" = '{run.distance}', "Notes" = '{run.notes}', "RPE" = '{run.rpe}', "Shoe" = '{run.shoe}' WHERE "RunDate" = '{run.date}' AND "id" = '{run.id}';`,
  deleteRun: `DELETE FROM "RunLog" WHERE "RunDate" = '{run.date}' AND "Distance" = '{run.distance}' AND "Notes" = '{run.notes}' AND "RPE" = '{run.rpe}' AND "Shoe" = '{run.shoe}';`,
  viewAllPersonalBests: `SELECT * FROM "PersonalBests" ORDER BY "Time" ASC;`,
  editPersonalBest: `UPDATE "PersonalBests" SET "Time" = '{time}' WHERE "Distance" = '{distance}'`,
  viewAllShoes: `SELECT * FROM "Shoes";`,
  addNewShoes: `Insert into "Shoes" values ('{shoe.brand}', '{shoe.name}', 0, true);`,
  increaseShoeDistance: `UPDATE "Shoes" SET "Distance" = "Distance" + '{shoe.distance}' WHERE "Brand" = '{shoe.brand}' AND "Name" = '{shoe.name}';`,
  decreaseShoeDistance: `UPDATE "Shoes" SET "Distance" = "Distance" - '{shoe.distance}' WHERE "Brand" = '{shoe.brand}' AND "Name" = '{shoe.name}';`,
  reactivateShoe: `UPDATE "Shoes" SET "Active" = true WHERE "Brand" = '{shoe.brand}' AND "Name" = '{shoe.name}';`,
  retireShoe: `UPDATE "Shoes" SET "Active" = false WHERE "Brand" = '{shoe.brand}' AND "Name" = '{shoe.name}';`,
  deleteShoe: `DELETE FROM "Shoes" WHERE "Brand" = '{shoe.brand}' AND "Name" = '{shoe.name}';`,
};

module.exports = coreQueries;
