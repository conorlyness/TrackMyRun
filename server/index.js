const express = require('express');
const db = require('./db');
const cors = require('cors');
const app = express();
const API_PORT = 3001;

app.use(express.json());
app.use(cors());

//API routes

app.get('/allRuns', async (req, res) => {
    console.log("calling /allRuns");
    const viewAllRuns = await db.viewAllRuns();
    if (viewAllRuns) {
      return res.status(201).json(viewAllRuns);
    }
    res.status(404);
  });

  app.post('/specificRuns', async (req, res) => {
    console.log("calling /specificRuns");
    const viewAllRuns = await db.viewallRunsInRange(req.body.start, req.body.end);
    if (viewAllRuns) {
      return res.status(201).json(viewAllRuns);
    }
    res.status(404);
  });

  app.post('/logRun', async (req, res) => {
    console.log("calling /logRun");
    const {date, distance, notes} = req.body;
    const result = await db.logRun(req.body);
    if (result) {
        return res.status(200).json(result);
    }
    res.status(404);
  })

  app.post('/editRun', async (req, res) => {
    console.log("calling /editRun");
    const {date, distance, notes} = req.body;
    const result = await db.editRun(req.body);
    if (result) {
        return res.status(200).json(result);
    }
    res.status(404);
  })


app.listen(API_PORT, () => {
    db.connect();
    console.log(`listening on port ${API_PORT}`);
  });
  
  module.exports = app;