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
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
  }
});
let upload = multer({
  storage: storage
});


// POST File
app.post('/api/upload', upload.single('image'), function (req, res) {
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false
    });
  } else {
    console.log('File is available!');
    return res.send({
      success: true
    })
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