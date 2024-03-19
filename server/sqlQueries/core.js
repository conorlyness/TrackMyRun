let coreQueries = {
  viewAllRuns: `SELECT * FROM public.runlog ORDER BY "rundate" DESC;`,
  viewAllRunsInRange: `select "rundate", "distance", "notes", "rpe", "tags", "shoe" from "runlog" where "rundate" >= '{start}' and "rundate" <= '{end}';`,
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
  getAllSchedule: `SELECT * FROM public.runschedule where "date" >= '{schedule.start}' and "date" <= '{schedule.end}';`,
  scheduleRun: `Insert into public.runschedule ("date", "distance", "notes", "completed", "race", "incomplete") values ('{run.date}', '{run.distance}', '{run.notes}', '{run.completed}', '{run.race}', '{run.incomplete}');`,
  editSchedule: `UPDATE public.runschedule SET "distance" = '{run.distance}', "notes" = '{run.notes}', "race" = '{run.race}' WHERE "date" = '{run.date}';`,
  markScheduleAsComplete: `UPDATE public.runschedule SET "completed" = true WHERE "date" = '{run.date}';`,
  markScheduleAsIncomplete: `UPDATE public.runschedule SET "incomplete" = true WHERE "date" = '{run.date}';`,
  deleteSchedule: `DELETE FROM public.runschedule WHERE "date" = '{run.date}' AND "distance" = '{run.distance}';`,
  getAllRaces: `SELECT * FROM public.runschedule WHERE "race" = true ORDER BY "date" ASC;`,
};

let coreQueriesSqlite = {
  viewAllRuns: `SELECT * FROM runlog ORDER BY rundate DESC`,
  viewAllRunsInRange: `SELECT rundate, distance, notes, rpe, tags, shoe FROM runlog WHERE rundate >= '{start}' AND rundate <= '{end}';`,
  logRun: `INSERT INTO runlog (rundate, distance, notes, rpe, shoe, tags) VALUES ('{run.date}', '{run.distance}', '{run.notes}', '{run.rpe}', '{run.shoes}', '{run.tags}');`,
  editRun: `UPDATE runlog SET distance = '{run.distance}', notes = '{run.notes}', rpe = '{run.rpe}', shoe = '{run.shoe}', tags = '{run.tags}' WHERE rundate = '{run.date}' AND id = '{run.id}';`,
  deleteRun: `DELETE FROM runlog WHERE rundate = '{run.date}' AND distance = '{run.distance}' AND notes = '{run.notes}' AND rpe = '{run.rpe}' AND shoe = '{run.shoe}';`,
  viewAllPersonalBests: `SELECT * FROM personalbests ORDER BY time ASC;`,
  editPersonalBest: `UPDATE personalbests SET time = '{time}' WHERE distance = '{distance}';`,
  viewAllShoes: `SELECT * FROM shoes;`,
  addNewShoes: `INSERT INTO shoes (brand, name, distance, active) VALUES ('{shoe.brand}', '{shoe.name}', 0, 1);`,
  increaseShoeDistance: `UPDATE shoes SET distance = distance + '{shoe.distance}' WHERE brand = '{shoe.brand}' AND name = '{shoe.name}';`,
  decreaseShoeDistance: `UPDATE shoes SET distance = distance - '{shoe.distance}' WHERE brand = '{shoe.brand}' AND name = '{shoe.name}';`,
  reactivateShoe: `UPDATE shoes SET active = 1 WHERE brand = '{shoe.brand}' AND name = '{shoe.name}';`,
  retireShoe: `UPDATE shoes SET active = 0 WHERE brand = '{shoe.brand}' AND name = '{shoe.name}';`,
  deleteShoe: `DELETE FROM shoes WHERE brand = '{shoe.brand}' AND name = '{shoe.name}';`,
  addImage: `INSERT INTO images (url, description, tags) VALUES ('{img.url}', '{img.description}', '{img.tags}');`,
  getAllImages: `SELECT * FROM images;`,
  getAllSchedule: `SELECT * FROM runschedule WHERE date >= '{schedule.start}' AND date <= '{schedule.end}';`,
  scheduleRun: `INSERT INTO runschedule (date, distance, notes, completed, race, incomplete) VALUES ('{run.date}', '{run.distance}', '{run.notes}', '{run.completed}', '{run.race}', '{run.incomplete}');`,
  editSchedule: `UPDATE runschedule SET distance = '{run.distance}', notes = '{run.notes}', race = '{run.race}' WHERE date = '{run.date}';`,
  markScheduleAsComplete: `UPDATE runschedule SET completed = 1 WHERE date = '{run.date}';`,
  markScheduleAsIncomplete: `UPDATE runschedule SET incomplete = 1 WHERE date = '{run.date}';`,
  deleteSchedule: `DELETE FROM runschedule WHERE date = '{run.date}' AND distance = '{run.distance}';`,
  getAllRaces: `SELECT * FROM runschedule WHERE race = 1 ORDER BY date ASC;`,
  createTables: `CREATE TABLE runlog (
  rundate DATE,
  distance TEXT, 
  notes TEXT, 
  rpe INT,
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shoe TEXT,
  tags TEXT 
);

CREATE TABLE personalbests (
  distance TEXT, 
  time TEXT 
);

CREATE TABLE shoes (
  brand TEXT, 
  name TEXT, 
  distance REAL,
  active BOOLEAN
);

CREATE TABLE Images (
  Url TEXT, 
  description TEXT,
  tags TEXT 
);

CREATE TABLE RunSchedule (
  Date DATE,
  Distance TEXT,
  Notes TEXT, 
  Completed BOOLEAN,
  Race BOOLEAN,
  Incomplete BOOLEAN
);`,
};

module.exports = { coreQueries, coreQueriesSqlite };
