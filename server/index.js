const express = require('express');
const db = require('./db');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
var path = require('path');
const app = express();
const API_PORT = 3001;

app.use(express.json());
app.use(cors());

//swagger stats
var swStats = require('swagger-stats');
var tlBucket = 60000;

// Load your swagger specification
// var apiSpec = require('./swagger.json');

// Enable swagger-stats middleware
app.use(
  swStats.getMiddleware({
    name: 'swagger-stats-TrackMyRun',
    version: '0.99.2',
    timelineBucketDuration: tlBucket,
    uriPath: '/swagger-stats',
    elasticsearch: 'http://127.0.0.1:9200',
  })
);

//API routes

app.get('/', function (req, res) {
  res.redirect('/swagger-stats/');
});

// express.static to make the images im the upload folder accessible
app.use(express.static('uploads'));
var allImages = [];

//path to which the images will be saved
const PATH = './uploads';
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({
  storage: storage,
});

// POST File
app.post('/api/upload', upload.single('image'), function (req, res) {
  if (!req.file) {
    console.log('No file is available!');
    return res.send({
      success: false,
    });
  } else {
    console.log('File is available!');
    return res.send({
      success: true,
    });
  }
});

app.get('/allImages', async (req, res) => {
  allImages = [];
  res.set('Content-Type', 'image/jpeg');
  fs.readdirSync('./uploads').forEach((file) => {
    var img = 'http://localhost:3001/' + file;
    allImages.push(img);
  });

  res.send(allImages);
});

app.get('/allRuns', async (req, res) => {
  console.log('calling /allRuns');
  const viewAllRuns = await db.viewAllRuns();
  if (viewAllRuns) {
    return res.status(201).json(viewAllRuns);
  }
  res.status(404);
});

app.post('/specificRuns', async (req, res) => {
  console.log('calling /specificRuns');
  const viewAllRuns = await db.viewallRunsInRange(req.body.start, req.body.end);
  if (viewAllRuns) {
    return res.status(201).json(viewAllRuns);
  }
  res.status(404);
});

app.post('/logRun', async (req, res) => {
  console.log('calling /logRun');
  const { date, distance, notes } = req.body;
  const result = await db.logRun(req.body);
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.post('/editRun', async (req, res) => {
  console.log('calling /editRun');
  const { date, distance, notes } = req.body;
  const result = await db.editRun(req.body);
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.post('/deleteRun', async (req, res) => {
  console.log('calling /deleteRun');
  const result = await db.deleteRun(req.body);
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/dayOfWeekDistance', async (req, res) => {
  console.log('calling /dayOfWeekDistance');
  const result = await db.sumOfRunsOnDaysOfWeek();

  if (result) {
    return res.status(200).json(result);
  }

  res.status(404);
});

app.post('/totalForMonthYear', async (req, res) => {
  console.log('calling /totalForMonthYear');
  const { month, year } = req.body;
  const result = await db.totalDistanceByMonthAndYear(month, year);
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.post('/dailyAvgForMonthYear', async (req, res) => {
  console.log('calling /dailyAvgForMonthYear');
  const { month, year } = req.body;
  const result = await db.averageDistancePerDayInMonthAndYear(month, year);
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/totalDistance', async (req, res) => {
  console.log('calling /totalDistance');
  const result = await db.totalDistanceRan();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/longestRun', async (req, res) => {
  console.log('calling /longestRun');
  const result = await db.longestRun();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/currentWeekTotal', async (req, res) => {
  console.log('calling /currentWeekTotal');
  const result = await db.totalDistanceThisCurrentWeek();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/last6MonthsTotal', async (req, res) => {
  console.log('calling /last6MonthsTotal');
  const result = await db.totalDistanceLast6Months();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.listen(API_PORT, () => {
  db.connect();
  console.log(`listening on port ${API_PORT}`);
});

module.exports = app;
